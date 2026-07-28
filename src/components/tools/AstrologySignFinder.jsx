import React, { useState } from 'react';
import { Compass, Star } from 'lucide-react';

const ZODIAC_DATA = [
  { sign: 'Aries', telugu: 'మేష రాశి', start: [3, 21], end: [4, 19], element: 'Fire (అగ్ని)', planet: 'Mars (కుజుడు)', traits: 'Bold, Ambitious, Energetic (ధైర్యం, నాయకత్వం)' },
  { sign: 'Taurus', telugu: 'వృషభ రాశి', start: [4, 20], end: [5, 20], element: 'Earth (భూమి)', planet: 'Venus (శుక్రుడు)', traits: 'Reliable, Patient, Practical (స్థిరత్వం, ఓర్పు)' },
  { sign: 'Gemini', telugu: 'మిథున రాశి', start: [5, 21], end: [6, 20], element: 'Air (వాయువు)', planet: 'Mercury (బుధుడు)', traits: 'Witty, Curious, Communicative (బుద్ధి చతురత)' },
  { sign: 'Cancer', telugu: 'కర్కాటక రాశి', start: [6, 21], end: [7, 22], element: 'Water (జలం)', planet: 'Moon (చంద్రుడు)', traits: 'Nurturing, Intuitive, Protective (దయ, మనస్సు)' },
  { sign: 'Leo', telugu: 'సింహ రాశి', start: [7, 23], end: [8, 22], element: 'Fire (అగ్ని)', planet: 'Sun (సూర్యుడు)', traits: 'Regal, Generous, Charismatic (రాచరికం, ఉదారత)' },
  { sign: 'Virgo', telugu: 'కన్యా రాశి', start: [8, 23], end: [9, 22], element: 'Earth (భూమి)', planet: 'Mercury (బుధుడు)', traits: 'Analytical, Meticulous, Helpful (క్రమశిక్షణ)' },
  { sign: 'Libra', telugu: 'తులా రాశి', start: [9, 23], end: [10, 22], element: 'Air (వాయువు)', planet: 'Venus (శుక్రుడు)', traits: 'Charming, Harmonious, Balanced (న్యాయం, బ్యాలెన్స్)' },
  { sign: 'Scorpio', telugu: 'వృశ్చిక రాశి', start: [10, 23], end: [11, 21], element: 'Water (జలం)', planet: 'Mars (కుజుడు)', traits: 'Passionate, Resourceful, Deep (శక్తి, పరిశోధన)' },
  { sign: 'Sagittarius', telugu: 'ధనుస్సు రాశి', start: [11, 22], end: [12, 21], element: 'Fire (అగ్ని)', planet: 'Jupiter (గురుడు)', traits: 'Optimistic, Philosophical, Free Spirit (ధర్మం, నిజాయితీ)' },
  { sign: 'Capricorn', telugu: 'మకర రాశి', start: [12, 22], end: [1, 19], element: 'Earth (భూమి)', planet: 'Saturn (శని)', traits: 'Disciplined, Goal-Driven, Wise (కృషి, పట్టుదల)' },
  { sign: 'Aquarius', telugu: 'కుంభ రాశి', start: [1, 20], end: [2, 18], element: 'Air (వాయువు)', planet: 'Saturn (శని)', traits: 'Innovative, Humanistic, Original (సృజనాత్మకత)' },
  { sign: 'Pisces', telugu: 'మీన రాశి', start: [2, 19], end: [3, 20], element: 'Water (జలం)', planet: 'Jupiter (గురుడు)', traits: 'Compassionate, Artistic, Spiritual (ఆధ్యాత్మికత)' }
];

export default function AstrologySignFinder() {
  const [dob, setDob] = useState('');
  const [zodiacResult, setZodiacResult] = useState(null);

  const findZodiac = (e) => {
    e.preventDefault();
    if (!dob) return;

    const date = new Date(dob);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const matched = ZODIAC_DATA.find((z) => {
      const [m1, d1] = z.start;
      const [m2, d2] = z.end;
      if (m1 === month && day >= d1) return true;
      if (m2 === month && day <= d2) return true;
      return false;
    });

    setZodiacResult(matched || ZODIAC_DATA[0]);
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 my-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200">
          <Star className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 font-telugu">
            Zodiac & Element Finder (రాశి & తత్వ శోధని)
          </h3>
          <p className="text-sm text-slate-600 font-medium">
            మీ పుట్టిన తేదీ ఇవ్వగానే మీ సూర్య రాశి మరియు భూత తత్వం తెలుసుకోండి
          </p>
        </div>
      </div>

      <form onSubmit={findZodiac} className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="date"
          required
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
        />
        <button
          type="submit"
          className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
        >
          <Compass className="w-5 h-5" />
          <span className="font-telugu">Find Sign (రాశి కనుగొను)</span>
        </button>
      </form>

      {zodiacResult && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs uppercase font-bold text-indigo-700">Zodiac Sign (రాశి)</span>
              <h4 className="text-2xl font-extrabold text-slate-900 font-telugu">
                {zodiacResult.sign} - {zodiacResult.telugu}
              </h4>
            </div>
            <div className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-800 text-sm font-bold">
              {zodiacResult.element}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700 font-medium">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-indigo-700 font-bold block mb-1">Ruling Planet (గ్రహాధిపతి)</span>
              <span className="font-bold text-slate-900">{zodiacResult.planet}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-indigo-700 font-bold block mb-1">Core Personality (స్వభావం)</span>
              <span className="font-bold text-slate-900 font-telugu">{zodiacResult.traits}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
