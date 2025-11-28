// src/data/mockData.ts
export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'career' | 'skill' | 'progress' | 'general';
  status: 'scheduled' | 'completed' | 'cancelled';
  participants: string[];
}

export const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Career Path Discussion with Advisor',
    date: '2024-01-15',
    time: '14:00',
    duration: '45min',
    type: 'career',
    status: 'scheduled',
    participants: ['Sarah Johnson (Career Advisor)']
  },
  {
    id: '2', 
    title: 'Technical Skills Review',
    date: '2024-01-16',
    time: '10:30',
    duration: '30min',
    type: 'skill',
    status: 'scheduled',
    participants: ['Mike Chen (Tech Mentor)']
  },
  {
    id: '3',
    title: 'Progress Check-in Meeting',
    date: '2024-01-18',
    time: '16:00',
    duration: '60min',
    type: 'progress', 
    status: 'scheduled',
    participants: ['Career Coach', 'Mentor']
  }
];