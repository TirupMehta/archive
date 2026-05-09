"use client";
import { useEffect } from 'react';

interface ConfirmModelProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  confirmColor?: string;
}

export default function ConfirmModel({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", confirmColor = "#ef4444" }: ConfirmModelProps) {
  if (!isOpen) return null;

  return (
    <div className="Model-overlay">
      <div className="Model-content">
        <div className="Model-header">
          <h3>{title}</h3>
        </div>
        <div className="Model-body">
          <p>{message}</p>
        </div>
        <div className="Model-actions">
          <button className="Model-btn cancel" onClick={onCancel}>Cancel</button>
          <button 
            className="Model-btn confirm" 
            style={{ backgroundColor: confirmColor }} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
