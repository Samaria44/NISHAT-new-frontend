import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CartProvider, { useCart } from '../CartContext';

function TestComp() {
  const { cartItems, addToCart } = useCart();

  const product = { _id: 'test123', name: 'Test Product', price: 5 };

  return (
    <div>
      <div data-testid="count">{cartItems.find(i => i._id === product._id)?.quantity || 0}</div>
      <button onClick={() => addToCart(product, 1)}>Add</button>
    </div>
  );
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('addToCart adds product and increments quantity', () => {
    render(
      <CartProvider>
        <TestComp />
      </CartProvider>
    );

    const btn = screen.getByText('Add');
    const count = () => screen.getByTestId('count');

    expect(count().textContent).toBe('0');

    act(() => fireEvent.click(btn));
    expect(count().textContent).toBe('1');

    act(() => fireEvent.click(btn));
    expect(count().textContent).toBe('2');

    // Check persistence in localStorage
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(stored.length).toBe(1);
    expect(stored[0]._id).toBe('test123');
    expect(stored[0].quantity).toBe(2);
  });
});
