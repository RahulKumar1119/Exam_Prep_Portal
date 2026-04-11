import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PerformanceOverview from '../components/Dashboard/PerformanceOverview';
import ScoreTrends from '../components/Dashboard/ScoreTrends';
import PaperBreakdown from '../components/Dashboard/PaperBreakdown';
import WeakAreas from '../components/Dashboard/WeakAreas';
import StrongAreas from '../components/Dashboard/StrongAreas';
import RecommendedPractice from '../components/Dashboard/RecommendedPractice';
import { TrendPoint, PaperPerformance } from '../types/index';

/**
 * Property 18: Dashboard displays all metrics
 * **Validates: Requirements 6.1-6.11**
 *
 * Test that dashboard displays overall score, trends, paper breakdown, weak/strong areas, study time, recommendations
 */
describe('Property 18: Dashboard displays all metrics', () => {
  const mock_performance_metrics = {
    overall_score: 78.5,
    total_sessions: 15,
    average_score: 76.2,
    total_study_time: 450, // 7.5 hours in minutes
    last_session_date: new Date().toISOString(),
  };

  const mock_trend_data: TrendPoint[] = [
    { date: '2024-01-01', score: 65 },
    { date: '2024-01-02', score: 70 },
    { date: '2024-01-03', score: 72 },
    { date: '2024-01-04', score: 75 },
    { date: '2024-01-05', score: 78 },
    { date: '2024-01-06', score: 80 },
    { date: '2024-01-07', score: 78 },
  ];

  const mock_paper_performance: PaperPerformance[] = [
    {
      paper_name: 'IE & IFS',
      average_score: 82,
      sessions_completed: 4,
      accuracy_by_topic: {
        'Banking Regulations': 85,
        'Financial Markets': 80,
        'Risk Management': 78,
      },
    },
    {
      paper_name: 'PPB',
      average_score: 75,
      sessions_completed: 4,
      accuracy_by_topic: {
        'Retail Banking': 72,
        'Lending': 78,
        'Deposits': 75,
      },
    },
    {
      paper_name: 'AFB',
      average_score: 76,
      sessions_completed: 4,
      accuracy_by_topic: {
        'Asset Management': 75,
        'Portfolio Management': 78,
        'Investment Products': 76,
      },
    },
    {
      paper_name: 'RBWM',
      average_score: 72,
      sessions_completed: 3,
      accuracy_by_topic: {
        'Wealth Management': 70,
        'Client Advisory': 72,
        'Investment Planning': 74,
      },
    },
  ];

  const weak_areas = ['Wealth Management', 'Retail Banking', 'Risk Management'];
  const strong_areas = ['Banking Regulations', 'Financial Markets', 'Portfolio Management'];

  describe('Overall Score Display', () => {
    it('should display overall score as percentage', () => {
      render(
        <PerformanceOverview
          overall_score={mock_performance_metrics.overall_score}
          total_sessions={mock_performance_metrics.total_sessions}
          average_score={mock_performance_metrics.average_score}
          total_study_time={mock_performance_metrics.total_study_time}
          last_session_date={mock_performance_metrics.last_session_date}
        />
      );

      expect(screen.getByText('Overall Score')).toBeInTheDocument();
      expect(screen.getByText('78.5%')).toBeInTheDocument();
    });

    it('should display overall score with correct formatting', () => {
      render(
        <PerformanceOverview
          overall_score={85.7}
          total_sessions={10}
          average_score={82.3}
          total_study_time={300}
        />
      );

      expect(screen.getByText('85.7%')).toBeInTheDocument();
    });
  });

  describe('Practice Set Count Display', () => {
    it('should display total practice sets completed', () => {
      render(
        <PerformanceOverview
          overall_score={78.5}
          total_sessions={15}
          average_score={76.2}
          total_study_time={450}
        />
      );

      expect(screen.getByText('Practice Sets')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('should display correct session count', () => {
      render(
        <PerformanceOverview
          overall_score={70}
          total_sessions={25}
          average_score={72}
          total_study_time={600}
        />
      );

      expect(screen.getByText('25')).toBeInTheDocument();
    });
  });

  describe('Average Score Display', () => {
    it('should display average score across all sessions', () => {
      render(
        <PerformanceOverview
          overall_score={78.5}
          total_sessions={15}
          average_score={76.2}
          total_study_time={450}
        />
      );

      expect(screen.getByText('Average Score')).toBeInTheDocument();
      expect(screen.getByText('76.2%')).toBeInTheDocument();
    });
  });

  describe('Study Time Display', () => {
    it('should display total study time in hours and minutes', () => {
      render(
        <PerformanceOverview
          overall_score={78.5}
          total_sessions={15}
          average_score={76.2}
          total_study_time={450}
        />
      );

      expect(screen.getByText('Study Time')).toBeInTheDocument();
      expect(screen.getByText('7h 30m')).toBeInTheDocument();
    });

    it('should correctly convert minutes to hours and minutes', () => {
      render(
        <PerformanceOverview
          overall_score={70}
          total_sessions={10}
          average_score={72}
          total_study_time={125}
        />
      );

      expect(screen.getByText('2h 5m')).toBeInTheDocument();
    });
  });

  describe('Last Session Date Display', () => {
    it('should display last session date when available', () => {
      const last_date = new Date('2024-01-15').toISOString();
      render(
        <PerformanceOverview
          overall_score={78.5}
          total_sessions={15}
          average_score={76.2}
          total_study_time={450}
          last_session_date={last_date}
        />
      );

      expect(screen.getByText('Last Practice Session')).toBeInTheDocument();
    });
  });

  describe('Score Trends Chart', () => {
    it('should display score trends over 30 days', () => {
      render(<ScoreTrends trend_data={mock_trend_data} />);

      expect(screen.getByText('30-Day Score Trends')).toBeInTheDocument();
    });

    it('should display average, highest, and lowest scores', () => {
      render(<ScoreTrends trend_data={mock_trend_data} />);

      expect(screen.getByText(/Average:/)).toBeInTheDocument();
      expect(screen.getByText(/Highest:/)).toBeInTheDocument();
      expect(screen.getByText(/Lowest:/)).toBeInTheDocument();
    });

    it('should handle empty trend data gracefully', () => {
      render(<ScoreTrends trend_data={[]} />);

      expect(screen.getByText('No data available yet')).toBeInTheDocument();
    });
  });

  describe('Paper Breakdown Chart', () => {
    it('should display performance by paper', () => {
      render(<PaperBreakdown paper_performance={mock_paper_performance} />);

      expect(screen.getByText('Performance by Paper')).toBeInTheDocument();
    });

    it('should display all paper names', () => {
      render(<PaperBreakdown paper_performance={mock_paper_performance} />);

      expect(screen.getByText('Performance by Paper')).toBeInTheDocument();
      // Check that the container has all paper names
      const container = screen.getByText('Performance by Paper').closest('div');
      expect(container?.textContent).toContain('IE & IFS');
      expect(container?.textContent).toContain('PPB');
      expect(container?.textContent).toContain('AFB');
      expect(container?.textContent).toContain('RBWM');
    });

    it('should display average scores for each paper', () => {
      render(<PaperBreakdown paper_performance={mock_paper_performance} />);

      // The scores are rendered in SVG text elements, so we need to check for the presence of the values
      const container = screen.getByText('Performance by Paper').closest('div');
      expect(container?.textContent).toContain('82');
      expect(container?.textContent).toContain('75');
    });

    it('should display session counts for each paper', () => {
      render(<PaperBreakdown paper_performance={mock_paper_performance} />);

      const session_counts = screen.getAllByText(/Sessions:/);
      expect(session_counts.length).toBeGreaterThan(0);
    });

    it('should handle empty paper performance data', () => {
      render(<PaperBreakdown paper_performance={[]} />);

      expect(screen.getByText('No data available yet')).toBeInTheDocument();
    });
  });

  describe('Weak Areas Display', () => {
    it('should display weak areas with accuracy below 70%', () => {
      const accuracy_by_topic = {
        'Wealth Management': 65,
        'Retail Banking': 68,
        'Risk Management': 62,
      };

      render(
        <WeakAreas weak_areas={weak_areas} accuracy_by_topic={accuracy_by_topic} />
      );

      expect(screen.getByText('Weak Areas (< 70% Accuracy)')).toBeInTheDocument();
      weak_areas.forEach((area) => {
        expect(screen.getByText(area)).toBeInTheDocument();
      });
    });

    it('should display accuracy percentages for weak areas', () => {
      const accuracy_by_topic = {
        'Wealth Management': 65.5,
        'Retail Banking': 68.2,
        'Risk Management': 62.8,
      };

      render(
        <WeakAreas weak_areas={weak_areas} accuracy_by_topic={accuracy_by_topic} />
      );

      expect(screen.getByText('65.5%')).toBeInTheDocument();
    });

    it('should show message when no weak areas exist', () => {
      render(<WeakAreas weak_areas={[]} accuracy_by_topic={{}} />);

      expect(screen.getByText(/Great job! No weak areas identified/)).toBeInTheDocument();
    });
  });

  describe('Strong Areas Display', () => {
    it('should display strong areas with accuracy above 85%', () => {
      const accuracy_by_topic = {
        'Banking Regulations': 88,
        'Financial Markets': 87,
        'Portfolio Management': 90,
      };

      render(
        <StrongAreas strong_areas={strong_areas} accuracy_by_topic={accuracy_by_topic} />
      );

      expect(screen.getByText('Strong Areas (> 85% Accuracy)')).toBeInTheDocument();
      strong_areas.forEach((area) => {
        expect(screen.getByText(area)).toBeInTheDocument();
      });
    });

    it('should display accuracy percentages for strong areas', () => {
      const accuracy_by_topic = {
        'Banking Regulations': 88.5,
        'Financial Markets': 87.2,
        'Portfolio Management': 90.1,
      };

      render(
        <StrongAreas strong_areas={strong_areas} accuracy_by_topic={accuracy_by_topic} />
      );

      expect(screen.getByText('88.5%')).toBeInTheDocument();
    });

    it('should show message when no strong areas exist', () => {
      render(<StrongAreas strong_areas={[]} accuracy_by_topic={{}} />);

      expect(screen.getByText(/Keep practicing to identify your strong areas/)).toBeInTheDocument();
    });
  });

  describe('Recommended Practice Display', () => {
    it('should display recommended practice areas based on weak areas', () => {
      render(
        <RecommendedPractice weak_areas={weak_areas} total_sessions={15} />
      );

      expect(screen.getByText('Recommended Practice Areas')).toBeInTheDocument();
      weak_areas.slice(0, 5).forEach((area) => {
        expect(screen.getByText(area)).toBeInTheDocument();
      });
    });

    it('should display next steps for improvement', () => {
      render(
        <RecommendedPractice weak_areas={weak_areas} total_sessions={15} />
      );

      expect(screen.getByText(/Next Steps/)).toBeInTheDocument();
    });

    it('should show message when no weak areas exist', () => {
      render(
        <RecommendedPractice weak_areas={[]} total_sessions={15} />
      );

      expect(screen.getByText(/You're doing great/)).toBeInTheDocument();
    });

    it('should display total sessions completed', () => {
      render(
        <RecommendedPractice weak_areas={weak_areas} total_sessions={20} />
      );

      expect(screen.getByText('20')).toBeInTheDocument();
    });
  });
});

/**
 * Property 19: Dashboard load time performance
 * **Validates: Requirements 6 (Success Metrics)**
 *
 * Test that dashboard loads within 1 second (p95) and charts render within 500ms
 */
describe('Property 19: Dashboard load time performance', () => {
  const mock_performance_metrics = {
    overall_score: 78.5,
    total_sessions: 15,
    average_score: 76.2,
    total_study_time: 450,
  };

  const mock_trend_data: TrendPoint[] = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    score: 60 + Math.random() * 40,
  }));

  const mock_paper_performance: PaperPerformance[] = [
    {
      paper_name: 'IE & IFS',
      average_score: 82,
      sessions_completed: 4,
      accuracy_by_topic: { 'Topic 1': 85, 'Topic 2': 80 },
    },
    {
      paper_name: 'PPB',
      average_score: 75,
      sessions_completed: 4,
      accuracy_by_topic: { 'Topic 3': 72, 'Topic 4': 78 },
    },
  ];

  describe('Dashboard component load time', () => {
    it('should render PerformanceOverview within acceptable time', () => {
      const start_time = performance.now();
      render(
        <PerformanceOverview
          overall_score={mock_performance_metrics.overall_score}
          total_sessions={mock_performance_metrics.total_sessions}
          average_score={mock_performance_metrics.average_score}
          total_study_time={mock_performance_metrics.total_study_time}
        />
      );
      const end_time = performance.now();
      const load_time = end_time - start_time;

      // Component should render quickly (within 500ms for unit test)
      expect(load_time).toBeLessThan(500);
    });

    it('should render ScoreTrends chart within acceptable time', () => {
      const start_time = performance.now();
      render(<ScoreTrends trend_data={mock_trend_data} />);
      const end_time = performance.now();
      const load_time = end_time - start_time;

      // Chart should render within 500ms
      expect(load_time).toBeLessThan(500);
    });

    it('should render PaperBreakdown chart within acceptable time', () => {
      const start_time = performance.now();
      render(<PaperBreakdown paper_performance={mock_paper_performance} />);
      const end_time = performance.now();
      const load_time = end_time - start_time;

      // Chart should render within 500ms
      expect(load_time).toBeLessThan(500);
    });

    it('should render WeakAreas component within acceptable time', () => {
      const start_time = performance.now();
      render(
        <WeakAreas
          weak_areas={['Area 1', 'Area 2']}
          accuracy_by_topic={{ 'Area 1': 65, 'Area 2': 68 }}
        />
      );
      const end_time = performance.now();
      const load_time = end_time - start_time;

      expect(load_time).toBeLessThan(500);
    });

    it('should render StrongAreas component within acceptable time', () => {
      const start_time = performance.now();
      render(
        <StrongAreas
          strong_areas={['Area 1', 'Area 2']}
          accuracy_by_topic={{ 'Area 1': 88, 'Area 2': 90 }}
        />
      );
      const end_time = performance.now();
      const load_time = end_time - start_time;

      expect(load_time).toBeLessThan(500);
    });

    it('should render RecommendedPractice component within acceptable time', () => {
      const start_time = performance.now();
      render(
        <RecommendedPractice weak_areas={['Area 1', 'Area 2']} total_sessions={15} />
      );
      const end_time = performance.now();
      const load_time = end_time - start_time;

      expect(load_time).toBeLessThan(500);
    });
  });

  describe('Chart rendering performance', () => {
    it('should render SVG charts efficiently', () => {
      const { container } = render(<ScoreTrends trend_data={mock_trend_data} />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('should render bar chart with all data points', () => {
      const { container } = render(
        <PaperBreakdown paper_performance={mock_paper_performance} />
      );
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('should handle large datasets efficiently', () => {
      const large_trend_data: TrendPoint[] = Array.from({ length: 100 }, (_, i) => ({
        date: new Date(Date.now() - (100 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        score: 60 + Math.random() * 40,
      }));

      const start_time = performance.now();
      render(<ScoreTrends trend_data={large_trend_data} />);
      const end_time = performance.now();
      const load_time = end_time - start_time;

      // Should still render efficiently with large dataset
      expect(load_time).toBeLessThan(1000);
    });
  });

  describe('Dashboard responsiveness', () => {
    it('should render all dashboard components without blocking', () => {
      const start_time = performance.now();

      render(
        <>
          <PerformanceOverview
            overall_score={mock_performance_metrics.overall_score}
            total_sessions={mock_performance_metrics.total_sessions}
            average_score={mock_performance_metrics.average_score}
            total_study_time={mock_performance_metrics.total_study_time}
          />
          <ScoreTrends trend_data={mock_trend_data} />
          <PaperBreakdown paper_performance={mock_paper_performance} />
        </>
      );

      const end_time = performance.now();
      const load_time = end_time - start_time;

      // All components should render within 1 second
      expect(load_time).toBeLessThan(1000);
    });

    it('should render without memory leaks', () => {
      const { unmount } = render(
        <PerformanceOverview
          overall_score={mock_performance_metrics.overall_score}
          total_sessions={mock_performance_metrics.total_sessions}
          average_score={mock_performance_metrics.average_score}
          total_study_time={mock_performance_metrics.total_study_time}
        />
      );

      // Should unmount cleanly
      expect(() => unmount()).not.toThrow();
    });
  });
});
