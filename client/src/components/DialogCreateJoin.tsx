import { Button } from './UI/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './UI/dialog';
import { Input } from './UI/input';
import { Label } from './UI/label';
import { useState } from 'react';

interface DialogCreateJoinProps {
  onClick: () => Promise<void>;
  playerName: string;
  setPlayerName: (name: string) => void;
  dialogTitle: string;
  buttonText: string;
  buttonTextDisplayed: string;
  hours?: number | null;
  setHours?: (hours: number) => void;
  minutes?: number;
  setMinutes?: (minutes: number) => void;
  limit?: number;
  setLimit?: (limit: number) => void;
  isCreating: boolean;
}

export function DialogCreateJoin({
  onClick,
  playerName,
  setPlayerName,
  dialogTitle,
  buttonText,
  buttonTextDisplayed,
  hours,
  setHours,
  minutes,
  setMinutes,
  limit,
  setLimit,
  isCreating,
}: DialogCreateJoinProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onClick();
      setIsOpen(false); // Close the dialog after the operation
    } catch (error) {
      console.error('Error executing onClick:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button variant="tertiary" className="bg-green-800 text-white hover:bg-green-700 transition-colors duration-300 px-6 py-2 rounded font-semibold shadow-lg">
      {buttonTextDisplayed}
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-md bg-gray-800 text-white rounded-lg shadow-2xl border border-cyan-500">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-green-500 mb-4">{dialogTitle}</DialogTitle>
    </DialogHeader>
    <div className="space-y-6">
      <div>
        <Label htmlFor="nickname" className="text-sm font-medium text-gray-300 mb-1 block">
          Player Name
        </Label>
        <Input
          disabled={loading}
          id="nickname"
          className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
          type="text"
          placeholder="Enter your nickname"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
      </div>
      {isCreating && (
        <>
          <div>
            <Label htmlFor="timeToPlay" className="text-sm font-medium text-gray-300 mb-1 block">
              Time to Play
            </Label>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  disabled={loading}
                  id="hours"
                  className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
                  type="number"
                  placeholder="Hours"
                  value={hours !== null ? hours : ''}
                  onChange={(e) => setHours && setHours(Number(e.target.value))}
                />
              </div>
              <div className="flex-1">
                <Input
                  disabled={loading}
                  id="minutes"
                  className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
                  type="number"
                  placeholder="Minutes"
                  value={minutes}
                  onChange={(e) => setMinutes && setMinutes(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="limit" className="text-sm font-medium text-gray-300 mb-1 block">
              Game Turns Limit
            </Label>
            <Input
              disabled={loading}
              id="limit"
              className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
              type="number"
              placeholder="Max turns"
              value={limit}
              onChange={(e) => setLimit && setLimit(Number(e.target.value))}
            />
          </div>
        </>
      )}
    </div>
    <DialogFooter className="mt-6">
      <Button
        isLoading={loading}
        isDisabled={loading}
        onClick={handleClick}
        variant="tertiary"
        className="w-full bg-green-600 text-white hover:bg-green-700 transition-colors duration-300 py-2 rounded-md font-semibold shadow-md"
      >
        {buttonText}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  );
}
