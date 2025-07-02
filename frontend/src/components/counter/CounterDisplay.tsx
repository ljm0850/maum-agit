'use client';

import useCounterStore from '@/src/stores/counterStore';
import React from 'react'; // React 임포트

export function CounterDisplay() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

  return (
    <div>
      <h2>Zustand 카운터 테스트 (클라이언트 상태)</h2>
      <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>현재 카운트: {count}</p>
      <button onClick={increment} style={{ marginRight: '10px', padding: '8px 15px', cursor: 'pointer' }}>
        증가 (+1)
      </button>
      <button onClick={decrement} style={{ marginRight: '10px', padding: '8px 15px', cursor: 'pointer' }}>
        감소 (-1)
      </button>
      <button onClick={reset} style={{ padding: '8px 15px', cursor: 'pointer' }}>
        초기화
      </button>
    </div>
  );
}