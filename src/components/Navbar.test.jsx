import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('renders Navbar component with brand', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText('APSport')).toBeTruthy();
  });

  it('renders all navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText('Inicio')).toBeTruthy();
    expect(screen.getByText('Pádel')).toBeTruthy();
    expect(screen.getByText('Atletismo')).toBeTruthy();
    expect(screen.getByText('Piscina')).toBeTruthy();
    expect(screen.getByText('Somos')).toBeTruthy();
    expect(screen.getByText('Contacto')).toBeTruthy();
  });

  it('renders the logo image', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const logo = screen.getByAltText('APSport Logo');
    expect(logo).toBeTruthy();
  });
});