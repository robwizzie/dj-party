import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';
import { buttonVariants } from './variants';

const Button = forwardRef(function Button({ className, variant, size, ...props }, ref) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'secondary', 'ghost']),
  size: PropTypes.oneOf(['default', 'sm', 'lg']),
  children: PropTypes.node
};

Button.defaultProps = {
  variant: 'default',
  size: 'default'
};

Button.displayName = 'Button';

export { Button };