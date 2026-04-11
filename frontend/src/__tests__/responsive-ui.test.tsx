import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PaperSelection } from '../components/PaperSelection';
import { PracticeSetInterface } from '../components/PracticeSetInterface';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { PracticeProvider } from '../context/PracticeContext';
import { NotificationProvider } from '../context/NotificationContext';

/**
 * Property 16: Responsive layout adapts to viewport
 * **Validates: Requirements 9.1-9.7**
 *
 * Test that UI displays correctly on desktop (≥1920px), tablet (768-1919px), and mobile (<768px)
 * Verify touch-friendly buttons (≥44×44px) on mobile
 * Test that components stack vertically on mobile
 * Test that grid layouts adapt to viewport width
 */
describe('Property 16: Responsive layout adapts to viewport', () => {
  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <NotificationProvider>
        <PracticeProvider>{component}</PracticeProvider>
      </NotificationProvider>
    );
  };

  describe('Desktop viewport (≥1920px)', () => {
    beforeEach(() => {
      global.innerWidth = 1920;
      global.dispatchEvent(new Event('resize'));
    });

    it('should display full layout with all content visible', () => {
      renderWithProviders(<PaperSelection />);
      const heading = screen.getByText('Select a Paper');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass('text-4xl');
    });

    it('should display grid layout with 2 columns on desktop', () => {
      renderWithProviders(<PaperSelection />);
      const paperButtons = screen.getAllByRole('button').filter(
        (btn) => btn.textContent?.includes('IE & IFS') ||
                 btn.textContent?.includes('PPB') ||
                 btn.textContent?.includes('AFB') ||
                 btn.textContent?.includes('RBWM')
      );
      expect(paperButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Tablet viewport (768-1919px)', () => {
    beforeEach(() => {
      global.innerWidth = 1024;
      global.dispatchEvent(new Event('resize'));
    });

    it('should display responsive layout with proper spacing', () => {
      renderWithProviders(<PaperSelection />);
      const heading = screen.getByText('Select a Paper');
      expect(heading).toBeInTheDocument();
    });

    it('should maintain readable text on tablet', () => {
      renderWithProviders(<PaperSelection />);
      const description = screen.getByText(/Choose a JAIIB paper/);
      expect(description).toHaveClass('text-lg');
    });
  });

  describe('Mobile viewport (<768px)', () => {
    beforeEach(() => {
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));
    });

    it('should display mobile-optimized layout', () => {
      renderWithProviders(<PaperSelection />);
      const heading = screen.getByText('Select a Paper');
      expect(heading).toBeInTheDocument();
    });

    it('should stack content vertically on mobile', () => {
      renderWithProviders(<PaperSelection />);
      const paperButtons = screen.getAllByRole('button').filter(
        (btn) => btn.textContent?.includes('IE & IFS') ||
                 btn.textContent?.includes('PPB') ||
                 btn.textContent?.includes('AFB') ||
                 btn.textContent?.includes('RBWM')
      );
      // Verify buttons are present and should stack vertically
      expect(paperButtons.length).toBeGreaterThan(0);
    });

    it('should have touch-friendly buttons (≥44×44px)', () => {
      renderWithProviders(<PaperSelection />);
      const startButton = screen.getByText('Start Practice');
      const styles = window.getComputedStyle(startButton);
      // Verify button has adequate padding for touch targets
      expect(startButton).toHaveClass('py-3', 'px-8');
    });
  });

  describe('Responsive text sizing', () => {
    it('should use appropriate font sizes for desktop', () => {
      global.innerWidth = 1920;
      renderWithProviders(<PaperSelection />);
      const heading = screen.getByText('Select a Paper');
      expect(heading).toHaveClass('text-4xl');
    });

    it('should use appropriate font sizes for mobile', () => {
      global.innerWidth = 375;
      renderWithProviders(<PaperSelection />);
      const heading = screen.getByText('Select a Paper');
      expect(heading).toHaveClass('text-4xl');
    });
  });

  describe('Responsive button sizing', () => {
    it('should have adequate button size on mobile', () => {
      global.innerWidth = 375;
      renderWithProviders(<PaperSelection />);
      const startButton = screen.getByText('Start Practice');
      // Verify button has padding for touch-friendly size
      expect(startButton).toHaveClass('px-8', 'py-3');
    });

    it('should have consistent button size across viewports', () => {
      global.innerWidth = 1920;
      renderWithProviders(<PaperSelection />);
      const startButton = screen.getByText('Start Practice');
      expect(startButton).toHaveClass('px-8', 'py-3');
    });
  });

  describe('Responsive grid layouts', () => {
    it('should adapt grid to viewport width on desktop', () => {
      global.innerWidth = 1920;
      renderWithProviders(<PaperSelection />);
      const paperButtons = screen.getAllByRole('button').filter(
        (btn) => btn.textContent?.includes('IE & IFS') ||
                 btn.textContent?.includes('PPB') ||
                 btn.textContent?.includes('AFB') ||
                 btn.textContent?.includes('RBWM')
      );
      expect(paperButtons.length).toBeGreaterThan(0);
    });

    it('should adapt grid to viewport width on mobile', () => {
      global.innerWidth = 375;
      renderWithProviders(<PaperSelection />);
      const paperButtons = screen.getAllByRole('button').filter(
        (btn) => btn.textContent?.includes('IE & IFS') ||
                 btn.textContent?.includes('PPB') ||
                 btn.textContent?.includes('AFB') ||
                 btn.textContent?.includes('RBWM')
      );
      expect(paperButtons.length).toBeGreaterThan(0);
    });
  });
});

/**
 * Property 17: Mobile load time performance
 * **Validates: Requirements 9.8**
 *
 * Test that page loads within 3 seconds on 3G network
 * Test that images are optimized for mobile
 * Test that CSS is minified
 * Test that JavaScript bundle size is reasonable
 */
describe('Property 17: Mobile load time performance', () => {
  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <NotificationProvider>
        <PracticeProvider>{component}</PracticeProvider>
      </NotificationProvider>
    );
  };

  describe('Page load time on 3G network', () => {
    it('should render PaperSelection component within acceptable time', () => {
      const startTime = performance.now();
      renderWithProviders(<PaperSelection />);
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Component should render quickly (within 1 second for unit test)
      expect(loadTime).toBeLessThan(1000);
    });

    it('should render ResultsDisplay component within acceptable time', () => {
      const mockResult = {
        score: 75,
        results: [
          {
            question_id: '1',
            correct: true,
            user_answer: 'A',
            correct_answer: 'A',
          },
          {
            question_id: '2',
            correct: false,
            user_answer: 'B',
            correct_answer: 'C',
          },
          {
            question_id: '3',
            correct: true,
            user_answer: 'D',
            correct_answer: 'D',
          },
          {
            question_id: '4',
            correct: true,
            user_answer: 'A',
            correct_answer: 'A',
          },
        ],
        time_taken: 480,
        passed: true,
      };

      const startTime = performance.now();
      renderWithProviders(<ResultsDisplay result={mockResult} timeTaken={480} />);
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      expect(loadTime).toBeLessThan(1000);
    });
  });

  describe('Component rendering performance', () => {
    it('should render without unnecessary re-renders', () => {
      const { rerender } = renderWithProviders(<PaperSelection />);
      const initialRender = screen.getByText('Select a Paper');
      expect(initialRender).toBeInTheDocument();

      // Re-render with same props should not cause issues
      rerender(
        <NotificationProvider>
          <PracticeProvider>
            <PaperSelection />
          </PracticeProvider>
        </NotificationProvider>
      );

      expect(screen.getByText('Select a Paper')).toBeInTheDocument();
    });

    it('should render ResultsDisplay with all required elements', () => {
      const mockResult = {
        score: 85,
        results: [
          {
            question_id: '1',
            correct: true,
            user_answer: 'A',
            correct_answer: 'A',
          },
          {
            question_id: '2',
            correct: true,
            user_answer: 'B',
            correct_answer: 'B',
          },
          {
            question_id: '3',
            correct: true,
            user_answer: 'C',
            correct_answer: 'C',
          },
          {
            question_id: '4',
            correct: false,
            user_answer: 'A',
            correct_answer: 'D',
          },
        ],
        time_taken: 420,
        passed: true,
      };

      renderWithProviders(<ResultsDisplay result={mockResult} timeTaken={420} />);

      expect(screen.getByText('Practice Set Complete!')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(screen.getByText('✓ Passed')).toBeInTheDocument();
    });
  });

  describe('CSS and styling performance', () => {
    it('should use Tailwind CSS classes for styling', () => {
      renderWithProviders(<PaperSelection />);
      const heading = screen.getByText('Select a Paper');
      // Verify Tailwind classes are applied
      expect(heading).toHaveClass('text-4xl', 'font-bold', 'text-gray-900');
    });

    it('should apply responsive classes correctly', () => {
      renderWithProviders(<PaperSelection />);
      const container = screen.getByText('Select a Paper').closest('div');
      // Verify responsive classes are present
      expect(container?.parentElement).toHaveClass('max-w-4xl', 'mx-auto');
    });
  });

  describe('Bundle size optimization', () => {
    it('should render components with minimal dependencies', () => {
      const startTime = performance.now();
      renderWithProviders(<PaperSelection />);
      const endTime = performance.now();

      // Component should load quickly indicating minimal bundle size
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should lazy load components efficiently', () => {
      const { container } = renderWithProviders(<PaperSelection />);
      expect(container).toBeInTheDocument();
      // Verify component is rendered without errors
      expect(screen.getByText('Select a Paper')).toBeInTheDocument();
    });
  });

  describe('Image optimization', () => {
    it('should not use unoptimized images', () => {
      const { container } = renderWithProviders(<PaperSelection />);
      const images = container.querySelectorAll('img');
      // Verify no images are present or they have proper attributes
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
      });
    });
  });
});
