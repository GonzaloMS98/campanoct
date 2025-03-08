import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Team {
  id: string;
  name: string;
  total_points: number;
}

interface Score {
  id: string;
  team_id: string;
  base_id: string;
  points: number;
  created_at: string;
  team: Team;
  base: { name: string };
}

export default function AdminDashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    // Fetch teams
    const { data: teamsData } = await supabase
      .from('teams')
      .select('*')
      .order('total_points', { ascending: false });

    // Fetch scores with team and base information
    const { data: scoresData } = await supabase
      .from('scores')
      .select(`
        *,
        team:teams(*),
        base:bases(name)
      `)
      .order('created_at', { ascending: false });

      const { data, error } = await supabase
      .from('scores')
      .select('team_id, sum:points', { head: false })
      // .group('team_id');
    
      if (error) {
        console.error('Error fetching total scores:', error);
      } else {
        // Update teams state
        setTeams((prevTeams) =>
          prevTeams.map((team) => {
            const teamScore = data.find((score) => score.team_id === team.id);
            return {
              ...team,
              total_points: teamScore ? teamScore.sum : 0, // Set total points, default to 0 if no score
            };
          })
        );
      }
    

if (error) {
  console.error('Error fetching total scores:', error);
} else {
  console.log('Total scores by team:', data);
}


    if (teamsData && teams.length === 0 ) setTeams(teamsData);
    if (scoresData) setScores(scoresData);
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Leaderboard */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Leaderboard</h2>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Points
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teams.map((team, index) => (
                  <tr key={team.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {team.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {team.total_points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Scores */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Scores</h2>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scores.map((score) => (
                  <tr key={score.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {score.team.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {score.base.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {score.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(score.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}