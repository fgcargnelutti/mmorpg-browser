import GameDialog from "../../../../components/GameDialog";
import { worldMapData } from "../../domain/worldMapData";
import "./WorldMapDialog.css";

type WorldMapDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function WorldMapDialog({
  isOpen,
  onClose,
}: WorldMapDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="world-overview-dialog-anchor">
      <GameDialog
        title={worldMapData.name}
        subtitle="A macro view of the surrounding regions. Points of interest and travel routes will be added here next."
        onClose={onClose}
      >
        <div className="world-overview-dialog">
          <div className="world-overview-dialog__frame">
            <img
              src={worldMapData.background}
              alt={worldMapData.description}
              className="world-overview-dialog__image"
              draggable={false}
            />
          </div>

          <div className="world-overview-dialog__caption">
            <strong>Frontier atlas</strong>
            <p>
              Dustveil Outpost and its surrounding regions now have a dedicated
              world map surface ready for future PoIs.
            </p>
          </div>
        </div>
      </GameDialog>
    </div>
  );
}
