import Link from 'next/link';

interface Props {
  activity: {
    id: string;
    title: string;
    courtName: string;
    address: string;
    dateTimeStart: string;
    maxPlayers: number;
    currentPlayerCount?: number;
    status: string;
    host?: { name: string };
  };
}

export default function ActivityCard({ activity }: Props) {
  const count = activity.currentPlayerCount ?? 0;
  const spotsLeft = activity.maxPlayers - count;
  const isFull = spotsLeft <= 0;

  return (
    <Link href={`/activities/${activity.id}`} className="block bg-white rounded-xl shadow hover:shadow-md transition-shadow p-4 border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{activity.title}</h3>
        <span className={`ml-2 flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {isFull ? 'Full' : `${spotsLeft} open`}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-1">{activity.courtName}</p>
      <p className="text-xs text-gray-400 mb-2">{activity.address}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{new Date(activity.dateTimeStart).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        <span>{new Date(activity.dateTimeStart).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      {activity.host && <p className="text-xs text-gray-400 mt-1">by {activity.host.name}</p>}
    </Link>
  );
}
