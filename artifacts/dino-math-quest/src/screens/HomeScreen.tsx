import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { COMPANIONS, LEARNING_AREAS, getCompanion, pickStableWeightedVariant } from '../content/dinoIslandContent';
import { CompanionId } from '../content/dinoIslandContent';

function CompanionButton({ companionId }: { companionId: CompanionId }) {
  const { state, selectCompanion } = useGame();
  const companion = getCompanion(companionId);
  const selected = state.selectedCompanionId === companionId;
  const variant = useMemo(() => pickStableWeightedVariant(companion.homeVariants, `home-button-${companion.id}`), [companion.homeVariants, companion.id]);

  return (
    <motion.button
      data-testid={`button-companion-${companion.id}`}
      whileTap={{ scale: 0.96 }}
      onClick={() => selectCompanion(companion.id)}
      className={`relative min-h-[74px] rounded-[1.4rem] border-4 p-2 shadow-md transition sm:min-h-[104px] sm:rounded-3xl ${
        selected ? 'border-emerald-500 bg-white' : 'border-white/80 bg-white/70'
      }`}
      style={{ boxShadow: selected ? `0 12px 24px ${companion.color}` : undefined }}
      aria-pressed={selected}
      aria-label={`Choose ${companion.shortLabel}. ${variant?.label ?? companion.role}`}
    >
      {selected && (
        <span className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white sm:right-2 sm:top-2 sm:h-8 sm:w-8">
          <Check size={20} strokeWidth={4} />
        </span>
      )}
      <div className="flex h-full flex-col items-center justify-center gap-1">
        {variant?.asset ? (
          <img src={variant.asset} alt="" className="h-9 w-full object-contain min-[420px]:h-11 sm:h-14" />
        ) : (
          <span className="text-2xl min-[420px]:text-3xl sm:text-4xl" aria-hidden="true">🦕</span>
        )}
        <span className="text-base font-extrabold leading-none text-slate-800 min-[420px]:text-lg sm:text-xl">{companion.shortLabel}</span>
      </div>
    </motion.button>
  );
}

export function HomeScreen() {
  const { state, startLearningArea } = useGame();
  const selectedCompanion = getCompanion(state.selectedCompanionId);
  const selectedVariant = useMemo(
    () => pickStableWeightedVariant(selectedCompanion.homeVariants, `home-button-${selectedCompanion.id}`),
    [selectedCompanion.homeVariants, selectedCompanion.id],
  );

  return (
    <div className="absolute inset-0 flex flex-col gap-2 overflow-y-auto bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-100 px-4 pb-4 pt-20 text-slate-800 sm:gap-4 sm:pb-5 sm:pt-24">
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <p className="text-base font-extrabold uppercase tracking-wide text-emerald-700 sm:text-lg">Family Home Base</p>
        <h1 className="text-[2rem] font-extrabold leading-none text-slate-900 sm:text-5xl">Dino Island</h1>
        <p className="mt-1 text-sm font-bold leading-tight text-slate-600 min-[420px]:text-base sm:mt-2 sm:text-xl">
          Pick a helper, then choose an adventure.
        </p>
      </section>

      <section className="mx-auto grid w-full max-w-3xl grid-cols-3 gap-1.5 min-[420px]:gap-2 sm:grid-cols-6" aria-label="Choose a companion">
        {COMPANIONS.map((companion) => (
          <CompanionButton key={companion.id} companionId={companion.id} />
        ))}
      </section>

      <section className="mx-auto flex w-full max-w-3xl items-center justify-center gap-2 rounded-[1.5rem] bg-white/45 p-2 shadow-inner sm:gap-3 sm:rounded-[2rem] sm:p-3">
        <div className="flex min-w-20 items-center justify-center sm:min-w-36 sm:flex-1">
          {selectedVariant?.asset ? (
            <img src={selectedVariant.asset} alt="" className="h-12 max-w-20 object-contain drop-shadow-sm min-[420px]:h-16 min-[420px]:max-w-24 sm:h-28 sm:max-w-40" />
          ) : (
            <span className="text-4xl leading-none min-[420px]:text-5xl sm:text-7xl" aria-hidden="true">🦕</span>
          )}
        </div>
        <div className="flex flex-1 flex-col items-start gap-1 text-left sm:items-center sm:gap-2 sm:text-center">
          <p className="text-lg font-extrabold leading-tight text-slate-800 sm:text-2xl">
            {selectedCompanion.id === 'none' ? 'Charlotte is exploring solo.' : `${selectedCompanion.shortLabel} is tagging along.`}
          </p>
          <p className="line-clamp-1 text-xs font-bold leading-tight text-slate-600 min-[420px]:text-base sm:line-clamp-2 sm:text-lg">
            {selectedVariant?.label ?? selectedCompanion.role}
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-2 min-[420px]:gap-3" aria-label="Choose a learning adventure">
        {LEARNING_AREAS.map((area) => (
          <motion.button
            key={area.id}
            data-testid={`button-learning-area-${area.id}`}
            whileTap={{ scale: 0.96 }}
            onClick={() => startLearningArea(area.id)}
            className="min-h-[82px] rounded-[1.4rem] border-4 border-white bg-white p-2 text-left shadow-lg min-[420px]:min-h-[94px] sm:min-h-[116px] sm:rounded-3xl sm:p-3"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-2xl min-[420px]:h-12 min-[420px]:w-12 min-[420px]:text-3xl sm:h-16 sm:w-16 sm:text-4xl" style={{ backgroundColor: area.accent }}>
                {area.icon}
              </span>
              <div className="min-w-0">
                <p className="text-lg font-extrabold leading-none text-slate-900 min-[420px]:text-xl sm:text-2xl">{area.shortLabel}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500 sm:text-sm">
                  {area.status === 'playable' ? 'Play now' : 'Soon'}
                </p>
              </div>
            </div>
            <p className="mt-1 hidden text-sm font-semibold leading-tight text-slate-600 min-[420px]:line-clamp-2 min-[420px]:block sm:mt-2 sm:text-base">{area.description}</p>
          </motion.button>
        ))}
      </section>
    </div>
  );
}
