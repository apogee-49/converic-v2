'use client';

import * as React from 'react';
import { motion, isMotionComponent, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

type AnyProps = Record<string, unknown>;

type DOMMotionProps<T extends HTMLElement = HTMLElement> = Omit<
  HTMLMotionProps<keyof HTMLElementTagNameMap>,
  'ref'
> & { ref?: React.Ref<T> };

type WithAsChild<Base extends object> =
  | (Base & { asChild: true; children: React.ReactElement })
  | (Base & { asChild?: false | undefined });

type SlotProps<T extends HTMLElement = HTMLElement> = {
  children: React.ReactElement;
} & DOMMotionProps<T>;

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
        return;
      }
      if (typeof ref === 'object' && 'current' in ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}

function toReactRef<T>(maybe: unknown): React.Ref<T> | undefined {
  if (typeof maybe === 'function') return maybe as React.RefCallback<T>;
  if (maybe && typeof maybe === 'object' && 'current' in (maybe as Record<string, unknown>)) {
    return maybe as React.MutableRefObject<T | null>;
  }
  return undefined;
}

function mergeProps<T extends HTMLElement>(
  childProps: AnyProps,
  slotProps: DOMMotionProps<T>,
): AnyProps {
  const merged: AnyProps = { ...childProps, ...slotProps };

  if (childProps.className || slotProps.className) {
    const childClass =
      typeof childProps.className === 'string' ? childProps.className : undefined;
    const slotClass =
      typeof slotProps.className === 'string' ? slotProps.className : undefined;
    merged.className = cn(childClass, slotClass);
  }

  if (childProps.style || slotProps.style) {
    const childStyle =
      childProps.style && typeof childProps.style === 'object'
        ? (childProps.style as React.CSSProperties)
        : undefined;
    const slotStyle = slotProps.style as React.CSSProperties | undefined;
    merged.style = { ...(childStyle ?? {}), ...(slotStyle ?? {}) };
  }

  return merged;
}

function Slot<T extends HTMLElement = HTMLElement>({
  children,
  ref,
  ...props
}: SlotProps<T>) {
  const isAlreadyMotion =
    typeof children.type === 'object' &&
    children.type !== null &&
    isMotionComponent(children.type);

  const Base = React.useMemo(
    () =>
      isAlreadyMotion
        ? (children.type as React.ElementType)
        : motion.create(children.type as React.ElementType),
    [isAlreadyMotion, children.type],
  );

  if (!React.isValidElement(children)) return null;

  const { ref: childRef, ...childProps } = children.props as AnyProps;

  const mergedProps = mergeProps(childProps, props);

  return (
    <Base {...mergedProps} ref={mergeRefs(toReactRef<T>(childRef), ref)} />
  );
}

export {
  Slot,
  type SlotProps,
  type WithAsChild,
  type DOMMotionProps,
  type AnyProps,
};
