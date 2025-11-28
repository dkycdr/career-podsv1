"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, X, Clock, Users } from "lucide-react";

interface MeetingDetailsProps {
  meetingId: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  joinUrl?: string;
  onClose?: () => void;
}

export default function MeetingDetails({ meetingId, title, date, time, duration, joinUrl, onClose }: MeetingDetailsProps) {
  const [showVideo, setShowVideo] = useState(false);

  const handleJoinMeeting = () => {
    if (joinUrl) {
      window.open(joinUrl, '_blank');
    } else {
      alert('Meeting room link is not yet available. Please try again later.');
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <div className="text-sm text-slate-500 mt-2 space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {date} at {time} ({duration} min)
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X className="w-5 h-5" />
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center">
          <Video className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to join?</h3>
          <p className="text-sm text-blue-700 mb-4">
            {joinUrl ? 'Click below to join the video meeting' : 'Meeting room will be available when the call starts'}
          </p>
          <Button 
            onClick={handleJoinMeeting} 
            disabled={!joinUrl}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <Video className="w-4 h-4 mr-2" />
            {joinUrl ? 'Join Meeting' : 'Waiting for Room...'}
          </Button>
        </div>

        <div className="bg-slate-50 p-4 rounded border border-slate-200">
          <h4 className="font-medium text-slate-900 mb-2">Meeting Info</h4>
          <div className="space-y-1 text-sm text-slate-600">
            <div>Meeting ID: <code className="bg-white px-2 py-1 rounded text-xs">{meetingId}</code></div>
            {joinUrl && <div>Room: <a href={joinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all">{joinUrl}</a></div>}
          </div>
        </div>

        <div className="text-xs text-slate-500 space-y-1">
          <p>💡 Tip: Join a few minutes early for a quick sound and video check.</p>
          <p>📱 You can join from any device — desktop, tablet, or phone.</p>
        </div>
      </CardContent>
    </Card>
  );
}
