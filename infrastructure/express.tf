# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "express-cluster"
}

# Task Definition
# Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "express-app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([{
    name  = "express-container"
    image = "${var.account_id}.dkr.ecr.us-east-2.amazonaws.com/${var.backend_app_name}:latest"
    portMappings = [{
      containerPort = 3000
      hostPort      = 3000
    }]
    environment = [
      { name = "PORT", value = var.backend_app_port },
      { name = "FRONTEND_URL", value = var.frontend_url },
      { name = "BACKEND_URL", value = var.backend_url },
      { name = "GOOGLE_CLIENT_ID", value = var.google_client_id },
    ]
    secrets = [
      { name = "DATABASE_URL", valueFrom = aws_secretsmanager_secret.database_url.arn },
      { name = "AWS_ACCOUNT_ID", valueFrom = aws_secretsmanager_secret.account_id.arn },
      { name = "AWS_ACCESS_KEY_ID", valueFrom = aws_secretsmanager_secret.access_key_id.arn },
      { name = "AWS_SECRET_ACCESS_KEY", valueFrom = aws_secretsmanager_secret.secret_access_key.arn },
      { name = "MONGODB_URI", valueFrom = aws_secretsmanager_secret.mongodb_uri.arn },
      { name = "OPENAI_API_KEY", valueFrom = aws_secretsmanager_secret.openai_api_key.arn },
      { name = "JWT_ACCESS_SECRET", valueFrom = aws_secretsmanager_secret.jwt_access_secret.arn },
      { name = "JWT_REFRESH_SECRET", valueFrom = aws_secretsmanager_secret.jwt_refresh_secret.arn },
      { name = "GOOGLE_CLIENT_SECRET", valueFrom = aws_secretsmanager_secret.google_client_secret.arn }
    ]
  }])
}

# ECS Service
resource "aws_ecs_service" "main" {
  name            = "express-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.public_subnet_ids
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.main.arn
    container_name   = "express-container"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.https]
}

resource "aws_lb" "main" {
  name               = "express-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnet_ids
}

# Target Group
resource "aws_lb_target_group" "main" {
  name        = "express-tg"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path                = "/"
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    matcher             = "200-499"
  }
}

# HTTPS Listener
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.acm_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.arn
  }
}

# HTTP to HTTPS Redirect
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# ALB Security Group
resource "aws_security_group" "alb" {
  name   = "alb-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ECS Security Group
resource "aws_security_group" "ecs" {
  name   = "ecs-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ECS Execution Role
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ECS Task Role
resource "aws_iam_role" "ecs_task_role" {
  name = "ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

# Route53 Record
resource "aws_route53_record" "api" {
  zone_id = var.route53_zone_id
  name    = "api.sobaii.ca"
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}
# Secrets for sensitive environment variables
resource "aws_secretsmanager_secret" "database_url" {
  name = "express-app/database_url"
}

resource "aws_secretsmanager_secret_version" "database_url" {
  secret_id     = aws_secretsmanager_secret.database_url.id
  secret_string = var.database_url
}

resource "aws_secretsmanager_secret" "account_id" {
  name = "express-app/account_id"
}

resource "aws_secretsmanager_secret_version" "account_id" {
  secret_id     = aws_secretsmanager_secret.account_id.id
  secret_string = var.account_id
}

resource "aws_secretsmanager_secret" "access_key_id" {
  name = "express-app/access_key_id"
}

resource "aws_secretsmanager_secret_version" "access_key_id" {
  secret_id     = aws_secretsmanager_secret.access_key_id.id
  secret_string = var.access_key_id
}

resource "aws_secretsmanager_secret" "secret_access_key" {
  name = "express-app/secret_access_key"
}

resource "aws_secretsmanager_secret_version" "secret_access_key" {
  secret_id     = aws_secretsmanager_secret.secret_access_key.id
  secret_string = var.secret_access_key
}

resource "aws_secretsmanager_secret" "mongodb_uri" {
  name = "express-app/mongodb_uri"
}

resource "aws_secretsmanager_secret_version" "mongodb_uri" {
  secret_id     = aws_secretsmanager_secret.mongodb_uri.id
  secret_string = var.mongodb_uri
}

resource "aws_secretsmanager_secret" "openai_api_key" {
  name = "express-app/openai_api_key"
}

resource "aws_secretsmanager_secret_version" "openai_api_key" {
  secret_id     = aws_secretsmanager_secret.openai_api_key.id
  secret_string = var.openai_api_key
}

resource "aws_secretsmanager_secret" "jwt_access_secret" {
  name = "express-app/jwt_access_secret"
}

resource "aws_secretsmanager_secret_version" "jwt_access_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_access_secret.id
  secret_string = var.jwt_access_secret
}

resource "aws_secretsmanager_secret" "jwt_refresh_secret" {
  name = "express-app/jwt_refresh_secret"
}

resource "aws_secretsmanager_secret_version" "jwt_refresh_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_refresh_secret.id
  secret_string = var.jwt_refresh_secret
}

resource "aws_secretsmanager_secret" "google_client_secret" {
  name = "express-app/google_client_secret"
}

resource "aws_secretsmanager_secret_version" "google_client_secret" {
  secret_id     = aws_secretsmanager_secret.google_client_secret.id
  secret_string = var.google_client_secret
}
