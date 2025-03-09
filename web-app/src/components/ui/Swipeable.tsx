import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  MouseEvent as ReactMouseEvent,
  HTMLAttributes,
  ReactNode,
} from 'react';

export interface SwipeableProps extends HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  closeDirection?: 'up' | 'down' | 'left' | 'right';
  closeTravel?: number;
  transition?: string;
  className?: string;
  children: ReactNode;
}

const Swipeable: React.FC<SwipeableProps> = ({
  visible,
  setVisible,
  closeDirection = 'right',
  closeTravel = 150,
  children,
  transition = 'transform 500ms cubic-bezier(0.32, 0.72, 0, 1)',
  className = '',
  ...props
}) => {
  const getTransformToHide = useCallback(() => {
    const axis = closeDirection === 'up' || closeDirection === 'down' ? 'Y' : 'X';
    const sign = closeDirection === 'up' || closeDirection === 'left' ? '-' : '';
    return `translate${axis}(${sign}100%)`;
  }, [closeDirection]);

  const [transitionStyle, setTransitionStyle] = useState<string>(transition);
  const [transform, setTransform] = useState<string>(getTransformToHide());
  const [modal, setModal] = useState<HTMLDivElement | null>(null);

  // Local variables to track dragging state.
  let dragging: boolean = false;
  let mouseDownClientY: number = 0;
  let mouseDownClientX: number = 0;
  let dragTravel: number = 0;
  const modalRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = event.target as HTMLElement;
    const interactiveElements = [
      'PRE',
      'INPUT',
      'TEXTAREA',
      'SELECT',
      'BUTTON',
      'A',
      'P',
      'SPAN',
      'H1',
      'H2',
      'H3',
      'H4',
      'H5',
      'H6'
    ];
    if (interactiveElements.includes(target.tagName) || target.isContentEditable) {
      return;
    }

    event.preventDefault();
    dragging = true;
    mouseDownClientY = event.clientY;
    mouseDownClientX = event.clientX;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    setTransitionStyle('');
  }, [closeDirection]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (dragging) {
      switch (closeDirection) {
        case 'up':
          dragTravel = mouseDownClientY - event.clientY;
          break;
        case 'down':
          dragTravel = event.clientY - mouseDownClientY;
          break;
        case 'left':
          dragTravel = mouseDownClientX - event.clientX;
          break;
        default:
          dragTravel = event.clientX - mouseDownClientX;
      }
      if (dragTravel >= 0) {
        const axis = closeDirection === 'up' || closeDirection === 'down' ? 'Y' : 'X';
        const sign = closeDirection === 'up' || closeDirection === 'left' ? '-' : '';
        setTransform(`translate${axis}(${sign}${dragTravel}px)`);
      }
    }
  }, [closeDirection]);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    setTransitionStyle(transition);
    dragging = false;
    if (dragTravel > closeTravel) {
      setVisible(false);
      setTransform(getTransformToHide());
    } else {
      setTransform('');
    }
    dragTravel = 0;
  }, [closeTravel, transition, setVisible, handleMouseMove, closeDirection]);

  useEffect(() => {
    if (modalRef.current) {
      setModal(modalRef.current);
      setTransform(visible ? '' : getTransformToHide());
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [modal, visible, handleMouseDown, handleMouseMove, handleMouseUp]);

  const directionClasses: { [key in 'up' | 'down' | 'left' | 'right']: string } = {
    up: 'top-0 left-0 w-full',
    down: 'bottom-0 left-0 w-full',
    left: 'top-0 left-0 h-full',
    right: 'top-0 right-0 h-full',
  };

  return (
    <div 
      {...props} 
      className={`fixed z-[1001] ${directionClasses[closeDirection]} ${className}`}
      ref={modalRef} 
      onMouseDown={handleMouseDown} 
      style={{ 
        transition: transitionStyle, 
        transform: transform 
      }}
    >
      {children}
    </div>
  );
};

export default Swipeable;