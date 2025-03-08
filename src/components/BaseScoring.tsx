import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface Team {
  id: string;
  name: string;
}

export default function BaseScoring() {
  const { session } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [points, setPoints] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    const { data } = await supabase
      .from('teams')
      .select('*')
      .order('name');
    
    if (data) setTeams(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Check if this team has already been scored for this base
      const { data: existingScore } = await supabase
        .from('scores')
        .select('*')
        .eq('team_id', selectedTeam)
        .eq('base_id', session?.user.id)
        .single();

      if (existingScore) {
        setError('This team has already been scored for your base');
        return;
      }
      const { data } = await supabase
        .from('bases')
        .select('*')
        .eq('email', session?.user.email)
        .single();

      // Insert new score
      const { error: scoreError } = await supabase
        .from('scores')
        .insert([
          {
            team_id: selectedTeam,
            base_id: data.id,
            points: points
          }
        ]);
      if (scoreError) throw scoreError;

      // Update team's total points
      const { error: updateError } = await supabase.rpc('update_team_points', {
        team_id: selectedTeam,
        points_to_add: points
      });

      if (updateError) throw updateError;

      setSuccess('Score recorded successfully!');
      setSelectedTeam('');
      setPoints(1);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseInt(e.target.value);
    const validValue = Math.min(10, Math.max(0, value));
    setPoints(validValue);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Base Scoring</h1>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}
              {success && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="text-sm text-green-700">{success}</div>
                </div>
              )}

              <div>
                <label htmlFor="team" className="block text-sm font-medium text-gray-700">
                  Select Team
                </label>
                <select
                  id="team"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  required
                >
                  <option value="">Choose a team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="points" className="block text-sm font-medium text-gray-700">
                  Points (1-10)
                </label>
                <input
                  type="number"
                  id="points"
                  value={points}
                  onChange={handlePointsChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Recording...' : 'Record Score'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}