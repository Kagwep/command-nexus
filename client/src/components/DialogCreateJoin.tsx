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
  buttonTextDisplayed:  React.ReactNode;
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
      <button className="group relative px-6 py-2 font-mono text-sm">
        {/* Border animation container */}
        <div className="absolute inset-0 border border-green-500/30 bg-green-900/20 
                      group-hover:bg-green-900/30 transition-all duration-300" />
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-400" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-400" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green-400" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-400" />
        
        {/* Content */}
        <span className="relative text-green-400 group-hover:text-green-300 transition-colors">
          {buttonTextDisplayed}
        </span>
      </button>
    </DialogTrigger>

    <DialogContent className="bg-gray-900/95 border-0 ">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Border frame */}
      <div className="absolute inset-0 border border-green-500/30" />
      <div className="absolute inset-0 border border-green-500/10 m-[1px]" />
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-400" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-green-400" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-green-400" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-400" />

      <div className="relative">
        <DialogHeader>
          <DialogTitle className="text-2xl font-mono text-green-400 flex items-center space-x-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>{dialogTitle}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="military-input-group">
            <Label 
              htmlFor="nickname" 
              className="text-sm font-mono text-green-400 mb-2 block"
            >
              OPERATIVE DESIGNATION
            </Label>
            <div className="relative">
              <Input
                disabled={loading}
                id="nickname"
                className="w-full bg-black/50 border border-green-500/30 text-green-400 
                         placeholder-green-700 font-mono focus:border-green-400 focus:ring-1 
                         focus:ring-green-400"
                type="text"
                placeholder="Enter designation"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </div>
          </div>

          {isCreating && (
            <>
              <div className="military-input-group">
                <Label 
                  htmlFor="timeToPlay" 
                  className="text-sm font-mono text-green-400 mb-2 block"
                >
                  OPERATION DURATION
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      disabled={loading}
                      id="hours"
                      className="w-full bg-black/50 border border-green-500/30 text-green-400 
                               placeholder-green-700 font-mono focus:border-green-400 
                               focus:ring-1 focus:ring-green-400"
                      type="number"
                      placeholder="Hours"
                      value={hours !== null ? hours : ''}
                      onChange={(e) => setHours?.(Number(e.target.value))}
                    />
                  </div>
                  <div className="relative">
                    <Input
                      disabled={loading}
                      id="minutes"
                      className="w-full bg-black/50 border border-green-500/30 text-green-400 
                               placeholder-green-700 font-mono focus:border-green-400 
                               focus:ring-1 focus:ring-green-400"
                      type="number"
                      placeholder="Minutes"
                      value={minutes}
                      onChange={(e) => setMinutes?.(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="military-input-group">
                <Label 
                  htmlFor="limit" 
                  className="text-sm font-mono text-green-400 mb-2 block"
                >
                  TACTICAL TURN LIMIT
                </Label>
                <div className="relative">
                  <Input
                    disabled={loading}
                    id="limit"
                    className="w-full bg-black/50 border border-green-500/30 text-green-400 
                             placeholder-green-700 font-mono focus:border-green-400 
                             focus:ring-1 focus:ring-green-400"
                    type="number"
                    placeholder="Maximum turns"
                    value={limit}
                    onChange={(e) => setLimit?.(Number(e.target.value))}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="mt-6">
          <button
            disabled={loading}
            onClick={handleClick}
            className="group relative w-full py-3 font-mono text-sm disabled:opacity-50"
          >
            {/* Button background & border */}
            <div className="absolute inset-0 bg-green-900/20 border border-green-500/30 
                          group-hover:bg-green-900/30 transition-all duration-300" />
            
            {/* Loading indicator */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            
            {/* Button text */}
            <span className="relative text-green-400 group-hover:text-green-300 
                           transition-colors flex items-center justify-center space-x-2">
              <span>◈</span>
              <span>{buttonText}</span>
              <span>◈</span>
            </span>
          </button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
  );
}
