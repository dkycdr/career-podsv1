
import { useState, useEffect } from 'react';

interface DashboardData {
  user: any;
  pods: any[];
  meetings: any[];
  goals: any[];
  skills: any[];
  achievements: any[];
  progress: any;
}

export function useStudentDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get user ID from localStorage (from login)
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          throw new Error('User not authenticated');
        }

        const response = await fetch(`/api/student/dashboard?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load dashboard: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setDashboardData(result.data);
        } else {
          throw new Error(result.error || 'Failed to load dashboard data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Dashboard loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const refetch = async () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      // Re-fetch logic could go here
      window.location.reload(); // Simple refresh for now
    }
  };

  return { dashboardData, loading, error, refetch };
}