import React, { ReactNode } from 'react';
import notionColorResolver from '@/functions/formaters/notionColorResolver';
import { cn } from '@/lib/utils';

type BadgeProps = {
  color?: string | undefined;
  isANotionPage?: boolean;
  children: ReactNode;
  className?: string;
};

type BadgeSubcomponentProps = {
  label: string;
};


/**
 * Badge component that displays a styled badge with customizable color and content.
 *
 * @component
 * @param {BadgeProps} props - The properties for the Badge component.
 * @param {string} [props.color='#97C9F0'] - The background color of the badge. Defaults to '#97C9F0' - a confortable tone of blue.
 * @param {React.ReactNode} props.children - The content to be displayed inside the badge.
 * @param {string} props.className - Additional CSS class to be applied to the badge.
 * @param {boolean} [props.isANotionPage=false] - Flag to determine if the badge is being used on a Notion page. Defaults to false.
 *
 * @returns {JSX.Element} The rendered Badge component.
 */
const Badge: React.FC<BadgeProps> & { Label: React.FC<BadgeSubcomponentProps>; } = ({
  color = '#97C9F0', 
  children, 
  isANotionPage = false,
  className = ""
}: BadgeProps): JSX.Element => {

  return (
    <div
      style={{ background: isANotionPage ? notionColorResolver(color) : color }}
      className={cn('py-1 px-2 uppercase rounded-md text-black-2 text-[10px] text-center font-semibold', className)}
    >
      {children}
    </div>
  );
};

Badge.displayName = 'Badge';


/**
 * Badge.Label subcomponent that displays a label inside the badge.
 * @component
 * @param {BadgeSubcomponentProps} props - The properties for the Badge.Label subcomponent. In this case, only the label is required.
 * @param {string} props.label - The label to be displayed inside the badge.
 * @returns {React.ReactElement} The rendered Badge.Label subcomponent.
 */
Badge.Label = ({ label }: BadgeSubcomponentProps): React.ReactElement => {
  return (
    <span>
      {label}
    </span>
  );
};

Badge.Label.displayName = 'BadgeLabel';

export default Badge;