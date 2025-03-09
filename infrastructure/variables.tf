variable "backend_app_name" {
  description = "App name"
  type        = string
  default     = "express-server"
}

variable "backend_app_port" {
  description = "Port for the application"
  type        = string
  default     = "3000"
}

variable "account_id" {
  description = "AWS account id"
  type        = string
  sensitive   = true
}

variable "database_url" {
  description = "Database connection URL"
  type        = string
}

variable "access_key_id" {
  description = "AWS access key ID"
  type        = string
  sensitive   = true
}

variable "secret_access_key" {
  description = "AWS secret access key"
  type        = string
  sensitive   = true
}

variable "mongodb_uri" {
  description = "MongoDB connection URI"
  type        = string
}

variable "openai_api_key" {
  description = "OpenAI API key"
  type        = string
  sensitive   = true
}

variable "jwt_access_secret" {
  description = "JWT access token secret"
  type        = string
  sensitive   = true
}

variable "jwt_refresh_secret" {
  description = "JWT refresh token secret"
  type        = string
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google client secret"
  type        = string
  sensitive   = true
}

variable "google_client_id" {
  description = "Google client ID"
  type        = string
}

variable "frontend_url" {
  description = "Frontend url"
  type        = string
  default     = "https://sobaii.ca"
}

variable "backend_url" {
  description = "Server url"
  type        = string
  default     = "https://api.sobaii.ca"
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs"
  type        = list(string)
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN"
  type        = string
}

variable "route53_zone_id" {
  description = "Route53 Hosted Zone ID"
  type        = string
}
