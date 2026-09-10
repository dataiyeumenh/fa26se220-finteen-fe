import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatVND(value) {
  if (!value || isNaN(value)) return '0 VNĐ'
  return new Intl.NumberFormat('vi-VN').format(Math.round(value)) + ' VNĐ'
}
