import "./WorldMap.css";
import ContextActions from "./ContextActions";
import NpcDialog from "./NpcDialog";
import CombatDialog from "./CombatDialog";
import mapImage from "../assets/map-town.png";
import type {
  LocationData,
  LocationKey,
  ContextAction,
} from "../data/locations";

type Player = {
  name: string;
  stamina: number;
  maxStamina: number;
  inventory: string[];
  logs: string[];
};

type DialogueOption = {
  id: string;
  label: string;
};

type WorldMapProps = {
  player: Player;
  currentLocation: LocationKey;
  contextState: "hidden" | "expanded" | "minimized";
  locations: Record<LocationKey, LocationData>;
  onTravel: (location: LocationKey) => void;
  onMinimizeContext: () => void;
  onExpandContext: () => void;
  onAction: (action: ContextAction) => void;

  npcDialogOpen: boolean;
  npcName: string;
  npcRole: string;
  npcDialogueLines: string[];
  npcDialogueOptions: DialogueOption[];
  npcLoreNotes: string[];
  onCloseNpcDialog: () => void;
  onNpcOptionSelect: (optionId: string) => void;
  onNpcBuy: () => void;
  onNpcSell: () => void;

  combatDialogOpen: boolean;
  combatEnemyName: string;
  combatEnemyTitle: string;
  combatEnemyHp: number;
  combatEnemyMaxHp: number;
  combatLog: string[];
  combatResolved: boolean;
  onCombatAttack: () => void;
  onCombatRetreat: () => void;
  onCloseCombatDialog: () => void;
};

export default function WorldMap({
  player,
  currentLocation,
  contextState,
  locations,
  onTravel,
  onMinimizeContext,
  onExpandContext,
  onAction,
  npcDialogOpen,
  npcName,
  npcRole,
  npcDialogueLines,
  npcDialogueOptions,
  npcLoreNotes,
  onCloseNpcDialog,
  onNpcOptionSelect,
  onNpcBuy,
  onNpcSell,
  combatDialogOpen,
  combatEnemyName,
  combatEnemyTitle,
  combatEnemyHp,
  combatEnemyMaxHp,
  combatLog,
  combatResolved,
  onCombatAttack,
  onCombatRetreat,
  onCloseCombatDialog,
}: WorldMapProps) {
  const activeLocation = locations[currentLocation];
  const locationEntries = Object.entries(locations) as [
    LocationKey,
    LocationData,
  ][];

  return (
    <div className="world-stage world-map-shell">
      <div className="world-map" style={{ backgroundImage: `url(${mapImage})` }}>
        {locationEntries.map(([locationKey, location]) => {
          const isActive = currentLocation === locationKey;

          return (
            <button
              key={locationKey}
              className={`poi poi-${location.poiVariant} ${
                isActive ? "is-active" : ""
              }`}
              type="button"
              style={{
                top: location.mapPosition.top,
                left: location.mapPosition.left,
              }}
              onClick={() => onTravel(locationKey)}
            >
              <span className="poi-dot" aria-hidden="true" />
              <span className="poi-label-group">
                <span className="poi-name">{location.name}</span>
                <span className="poi-subtitle">{location.subtitle}</span>
              </span>
            </button>
          );
        })}

        <ContextActions
          state={contextState}
          locationName={activeLocation.name}
          locationDescription={activeLocation.description}
          actions={activeLocation.actions}
          onMinimize={onMinimizeContext}
          onExpand={onExpandContext}
          onAction={onAction}
        />

        <NpcDialog
          isOpen={npcDialogOpen}
          npcName={npcName}
          npcRole={npcRole}
          dialogueLines={npcDialogueLines}
          dialogueOptions={npcDialogueOptions}
          loreNotes={npcLoreNotes}
          onClose={onCloseNpcDialog}
          onOptionSelect={onNpcOptionSelect}
          onBuy={onNpcBuy}
          onSell={onNpcSell}
        />

        <CombatDialog
          isOpen={combatDialogOpen}
          enemyName={combatEnemyName}
          enemyTitle={combatEnemyTitle}
          enemyHp={combatEnemyHp}
          enemyMaxHp={combatEnemyMaxHp}
          combatLog={combatLog}
          isResolved={combatResolved}
          onAttack={onCombatAttack}
          onRetreat={onCombatRetreat}
          onClose={onCloseCombatDialog}
        />
      </div>
    </div>
  );
}