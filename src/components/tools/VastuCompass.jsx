import React, { useState } from 'react';
import { Compass, CheckCircle, XCircle, Sparkles } from 'lucide-react';

const DIRECTIONS = {
  NE: {
    name: 'North-East (ఈశాన్యం)',
    element: 'Water (జలం)',
    planet: 'Jupiter (గురుడు)',
    bestFor: 'Pooja Room, Main Entrance, Open Space, Meditation (పూజ గది, ప్రధాన ద్వారం)',
    avoid: 'Kitchen (వంటగది), Toilets, Heavy Storage, Master Bedroom',
    tip: 'ఈశాన్యం ఎప్పుడూ పరిశుభ్రంగా, వెలుతురుతో మరియు తేలికగా ఉండాలి.'
  },
  SE: {
    name: 'South-East (ఆగ్నేయం)',
    element: 'Fire (అగ్ని)',
    planet: 'Venus (శుక్రుడు)',
    bestFor: 'Kitchen (వంటగది), Electric Inverter, Generator (విద్యుత్ పరికరాలు)',
    avoid: 'Water Tank, Bedrooms, Pooja Room, Main Door',
    tip: 'ఆగ్నేయం అగ్ని స్థానం. ఇక్కడ నీటి నిల్వలు ఉంటే ఆరోగ్య మరియు కుటుంబ కలహాలు రావచ్చు.'
  },
  SW: {
    name: 'South-West (నైరుతి)',
    element: 'Earth (భూమి)',
    planet: 'Rahu (రాహువు)',
    bestFor: 'Master Bedroom (యజమాని గది), Heavy Storage, Wardrobes (బీరువాలు)',
    avoid: 'Underground Water Tank, Pooja Room, Main Door, Open Space',
    tip: 'నైరుతి స్థిరత్వాన్ని సూచిస్తుంది. ఇల్లు లేదా ఆఫీసులో అత్యంత బరువైన నిర్మాణం నైరుతిలో ఉండాలి.'
  },
  NW: {
    name: 'North-West (వాయువ్యం)',
    element: 'Air (వాయువు)',
    planet: 'Moon (చంద్రుడు)',
    bestFor: 'Guest Room, Children Bedroom, Toilet & Bathroom, Vehicles (అతిథి గది)',
    avoid: 'Master Bedroom, Heavy Fixed Furniture',
    tip: 'వాయువ్యం చలన శక్తిని (Motion) సూచిస్తుంది. వ్యాపార సరుకులు త్వరగా అమ్ముడవడానికి ఇక్కడ ఉంచాలి.'
  },
  N: {
    name: 'North (ఉత్తరం)',
    element: 'Water (జలం)',
    planet: 'Mercury (బుధుడు / కుబేరుడు)',
    bestFor: 'Cash Locker (క్యాష్ బాక్స్), Living Room, Open Lawn (ఉత్తరం కుబేరుని దిశ)',
    avoid: 'Toilet, Heavy Storage, Dark Rooms',
    tip: 'ఉత్తరం దిశలో ల్యాప్‌టాప్ లేదా డెస్క్ ఉంచి వర్క్ చేయడం వల్ల ఆర్ధిక పురోగతి లభిస్తుంది.'
  },
  E: {
    name: 'East (తూర్పు)',
    element: 'Solar Energy (సూర్య కాంతి)',
    planet: 'Sun (సూర్యుడు)',
    bestFor: 'Main Door, Study Room, Windows (తూర్పు ద్వారం & కిటికీలు)',
    avoid: 'Toilets, Heavy Obstructions, Clutter',
    tip: 'ఉదయాన్నే సూర్యకాంతి ఇంట్లోకి ప్రసరించడం ఆరోగ్యానికి మరియు సకల శుభాలకు మూలం.'
  },
  S: {
    name: 'South (దక్షిణం)',
    element: 'Fire / Earth',
    planet: 'Mars (కుజుడు / యముడు)',
    bestFor: 'Bedrooms, Overhead Water Tank (ఎత్తైన పైన వాటర్ ట్యాంక్)',
    avoid: 'Underground Water, Main Entrance (unless specific pada)',
    tip: 'దక్షిణం దిశలో ఎత్తైన కాంపౌండ్ వాల్ ఉండటం సురక్షితం.'
  },
  W: {
    name: 'West (పడమర)',
    element: 'Air / Space',
    planet: 'Saturn (శని)',
    bestFor: 'Dining Room, Study Table, Overhead Water Tank (భోజన శాల)',
    avoid: 'Pooja Room, Main Entrance (unplanned)',
    tip: 'పడమర దిశలో భోజన శాల (Dining Table) అమర్చడం ద్వారా ఆహార లోపం ఉండదు.'
  }
};

export default function VastuCompass() {
  const [selectedDir, setSelectedDir] = useState('NE');
  const activeData = DIRECTIONS[selectedDir];

  return (
    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 my-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-teal-100 text-teal-700 rounded-xl border border-teal-200">
          <Compass className="w-6 h-6 text-teal-600 animate-spin-slow" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 font-telugu">
            Interactive Vastu Compass Guide (వాస్తు డిజిటల్ కంపాస్)
          </h3>
          <p className="text-sm text-slate-600 font-medium">
            ఏదైనా దిక్కు పై క్లిక్ చేసి గదుల సరైన అమరిక మరియు వాస్తు సలహాలు పొందండి
          </p>
        </div>
      </div>

      {/* Direction selector grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
        {Object.keys(DIRECTIONS).map((dirKey) => {
          const isSelected = selectedDir === dirKey;
          return (
            <button
              key={dirKey}
              onClick={() => setSelectedDir(dirKey)}
              className={`p-3 rounded-xl border text-center transition-all font-bold ${
                isSelected
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-105'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="block text-sm sm:text-base font-telugu">{dirKey}</span>
              <span className="text-[10px] font-medium block truncate opacity-90">
                {DIRECTIONS[dirKey].name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Direction View */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-200">
          <h4 className="text-2xl font-extrabold text-slate-900 font-telugu">
            {activeData.name}
          </h4>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-lg text-teal-800 text-xs font-bold">
              {activeData.element}
            </span>
            <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-700 text-xs font-medium">
              {activeData.planet}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-slate-700 font-medium">
          <div className="flex items-start gap-3 bg-teal-50 p-3.5 rounded-xl border border-teal-200">
            <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-xs uppercase font-bold text-teal-800 block">Recommended Rooms (అనుకూల గదులు)</span>
              <span className="font-telugu text-slate-900 font-medium">{activeData.bestFor}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-rose-50 p-3.5 rounded-xl border border-rose-200">
            <XCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-xs uppercase font-bold text-rose-800 block">Avoid Here (తప్పించాల్సినవి)</span>
              <span className="font-telugu text-slate-900 font-medium">{activeData.avoid}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-50 p-3.5 rounded-xl border border-amber-200">
            <Sparkles className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-xs uppercase font-bold text-amber-800 block">Vastu Secret Tip (కీలక చిట్కా)</span>
              <span className="font-telugu text-slate-800">{activeData.tip}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
