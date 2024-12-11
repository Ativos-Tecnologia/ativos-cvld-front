import React from "react";
import "./styles.css"

type SkeletonProps = {
  children: React.ReactNode;
  trigger: boolean;
};

const DynamicSkeleton: React.FC<SkeletonProps> = React.memo(
  ({ children, trigger }) => {
    const skeletonClasses =
      "bg-skeleton-light dark:bg-skeleton-dark soft_skeleton";

    const renderSkeleton = (child: React.ReactNode): React.ReactNode => {
      if (!React.isValidElement(child)) {
        return <div className={`h-4 ${skeletonClasses}`}></div>;
      }

      const { className, children: nestedChildren, ...props } = child.props;
      const isContainerOnly = className?.includes("dcontainer");

      if (isContainerOnly) {
        const updatedChildren = nestedChildren
          ? React.Children.toArray(nestedChildren).map(renderSkeleton)
          : null;

        return React.cloneElement(child, {
          ...props,
          className,
          children: updatedChildren,
        });
      }

      if (
        typeof nestedChildren === "string" ||
        typeof nestedChildren === "number"
      ) {
        return React.cloneElement(child, {
          ...props,
          className: `${className || ""} ${skeletonClasses}`,
          children: null,
        });
      }

      const updatedChildren = nestedChildren
        ? React.Children.toArray(nestedChildren).map(renderSkeleton)
        : null;

      return React.cloneElement(child, {
        ...props,
        className: `${className || ""} ${skeletonClasses}`,
        children: updatedChildren,
      });
    };

    return trigger ? (
      <>{React.Children.toArray(children).map(renderSkeleton)}</>
    ) : (
      <>{children}</>
    );
  },
  (prevProps, nextProps) =>
    prevProps.trigger === nextProps.trigger &&
    prevProps.children === nextProps.children
);

export default DynamicSkeleton;


DynamicSkeleton.displayName = "DynamicSkeleton";
