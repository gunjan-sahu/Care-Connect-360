'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: ElementType
}

export function Reveal({ children, className, delay = 0, as: Tag = 'div' }: RevealProps) {
  const element = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!element.current) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    })

    observer.observe(element.current)
    return () => observer.disconnect()
  }, [])

  const style = {
    '--reveal-delay': `${delay}ms`,
  } as CSSProperties

  return (
    <Tag
      ref={element}
      data-visible={visible}
      className={cn('reveal', className)}
      style={style}
    >
      {children}
    </Tag>
  )
}
