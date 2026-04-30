"use client"

import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { RotateCcw, Trash2 } from "lucide-react"

export interface LogEntry {
  id: string
  date: Date
  measurement: number
  notes?: string
}

interface LogHistoryProps {
  logs: LogEntry[]
  onUndo?: () => void
  onDelete?: (id: string) => void
}

export function LogHistory({ logs, onUndo, onDelete }: LogHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Log History</CardTitle>
        <CardDescription>Recent entries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No logs yet. Start tracking to see history.
            </p>
          ) : (
            logs.slice(0, 5).map((log) => {
              if (!Object.keys(log).length) return null;
              return (
                <div key={log.id + log?.date} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm">
                  <div>
                    <p className="font-semibold">
                      {log.measurement} {log?.notes ? "- " + log?.notes : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(log?.date).toLocaleDateString()}</p>
                  </div>
                  {onDelete && (
                    <Button size="sm" variant="ghost" onClick={() => onDelete(log?.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )
            })
          )}
        </div>
        {onUndo && logs.length > 0 && (
          <Button size="sm" variant="outline" className="w-full mt-3 bg-transparent" onClick={onUndo}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Undo Last
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
