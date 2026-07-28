import React, { useState } from 'react';
import { Sparkles, Calculator, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const LIFE_PATH_TRAITS = {
  1: { title: "1 - The Leader (నాయకుడు)", planet: "Sun (సూర్యుడు)", traits: "Independent, Ambitious, Pioneer, Strong Will Power (ఆత్మవిశ్వాసం, స్వతంత్ర ఆలోచనలు)", luckyColors: "Gold, Yellow, Orange", luckyDays: "Sunday, Monday" },
  2: { title: "2 - The Peacemaker (శాంతి ధూత)", planet: "Moon (చంద్రుడు)", traits: "Intuitive, Gentle, Diplomatic, Cooperative (దయ, మృదుస్వభావం, సహకారం)", luckyColors: "White, Light Green, Silver", luckyDays: "Monday, Friday" },
  3: { title: "3 - The Creative Communicator (సృజనాత్మక శీలి)", planet: "Jupiter (గురుడు)", traits: "Expressive, Optimistic, Artistic, Joyful (జ్ఞానం, కమ్యూనికేషన్, ఆనందం)", luckyColors: "Yellow, Purple, Pink", luckyDays: "Thursday, Tuesday" },
  4: { title: "4 - The Builder (కష్టపడే తత్వం)", planet: "Rahu (రాహువు)", traits: "Disciplined, Practical, Hardworking, Loyal (క్రమశిక్షణ, కృషి, నిజాయితీ)", luckyColors: "Blue, Grey, Khaki", luckyDays: "Saturday, Sunday" },
  5: { title: "5 - The Adventurer (స్వేచ్ఛా ప్రియుడు)", planet: "Mercury (బుధుడు)", traits: "Versatile, Freedom Lover, Quick Thinker, Adaptable (స్వేచ్ఛ, సమయస్ఫూర్తి)", luckyColors: "Green, White, Light Grey", luckyDays: "Wednesday, Friday" },
  6: { title: "6 - The Nurturer (ప్రేమాస్పదుడు)", planet: "Venus (శుక్రుడు)", traits: "Responsible, Loving, Family Oriented, Artistic (కుటుంబ ప్రేమ, బాధ్యత)", luckyColors: "Bright White, Royal Blue, Pink", luckyDays: "Friday, Tuesday" },
  7: { title: "7 - The Seeker & Scholar (పరిశోధకుడు)", planet: "Ketu (కేతువు)", traits: "Analytical, Spiritual, Intuitive, Deep Thinker (ఆధ్యాత్మికత, పరిశోధన)", luckyColors: "Light Yellow, Light Green, White", luckyDays: "Sunday, Thursday" },
  8: { title: "8 - The Powerhouse & Executive (అధికార మూర్తి)", planet: "Saturn (శని)", traits: "Ambitious, Financial Wizard, Powerful, Karma Believer (ధనం, అధికారం, కర్మ)", luckyColors: "Dark Blue, Black, Purple", luckyDays: "Saturday, Wednesday" },
  9: { title: "9 - The Humanitarian (సేవాతత్పరుడు)", planet: "Mars (కుజుడు)", traits: "Compassionate, Courageous, Generous, Global Mindset (ధైర్యం, సేవ, దయ)", luckyColors: "Red, Crimson, Rose", luckyDays: "Tuesday, Thursday" },
  11: { title: "11 - Master Intuitive (మాస్టర్ నంబర్ 11)", planet: "Uranus / Higher Moon", traits: "Spiritual Illuminator, Highly Intuitive, Inspiring Leader (మాస్టర్ ఇన్ట్యూషన్)", luckyColors: "Silver, Electric Blue", luckyDays: "Monday, Sunday" },
  22: { title: "22 - Master Builder (మాస్టర్ బిల్డర్ 22)", planet: "Pluto / Higher Rahu", traits: "Visionary Builder, Turning Dreams into Reality (గొప్ప లక్యాలు సాధించే శక్తి)", luckyColors: "Gold, Deep Blue", luckyDays: "Saturday, Thursday" }
};

export default function NumerologyCalculator() {
  const [dob, setDob] = useState('');
  const [fullName, setFullName] = useState('');
  const [result, setResult] = useState(null);

  const calculateNumerology = (e) => {
    e.preventDefault();
    if (!dob) return;

    const [year, month, day] = dob.split('-').map(Number);

    const reduceNum = (num, isMasterCheck = true) => {
      if (isMasterCheck && (num === 11 || num === 22 || num === 33)) return num;
      let sum = num;
      while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = String(sum).split('').reduce((acc, curr) => acc + Number(curr), 0);
      }
      return sum;
    };

    const dayReduced = reduceNum(day, false);
    const monthReduced = reduceNum(month, false);
    const yearReduced = reduceNum(year, false);

    const totalSum = dayReduced + monthReduced + yearReduced;
    const lifePath = reduceNum(totalSum, true);

    const chaldeanMap = {
      A:1, I:1, J:1, Q:1, Y:1, B:2, K:2, R:2, C:3, G:3, L:3, S:3, D:4, M:4, T:4, E:5, H:5, N:5, X:5, U:6, V:6, W:6, O:7, Z:7, F:8, P:8
    };

    let nameSum = 0;
    if (fullName.trim()) {
      const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
      for (let char of cleanName) {
        nameSum += chaldeanMap[char] || 0;
      }
      nameSum = reduceNum(nameSum, false);
    }

    const calculatedResult = {
      lifePath,
      nameNumber: nameSum || null,
      info: LIFE_PATH_TRAITS[lifePath] || LIFE_PATH_TRAITS[reduceNum(lifePath, false)]
    };

    setResult(calculatedResult);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 my-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 text-blue-700 rounded-xl border border-blue-200">
          <Sparkles className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 font-telugu">
            Interactive Numerology Calculator (న్యూమరాలజీ క్యాలిక్యులేటర్)
          </h3>
          <p className="text-sm text-slate-600 font-medium">
            మీ పుట్టిన తేదీ మరియు పేరు నమోదు చేసి వెంటనే ఫలితం చూడండి
          </p>
        </div>
      </div>

      <form onSubmit={calculateNumerology} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 font-telugu">
            1. Date of Birth (పుట్టిన తేదీ) *
          </label>
          <input
            type="date"
            required
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 font-telugu">
            2. Full Name (ఇంగ్లీష్‌లో పేరు) - optional
          </label>
          <input
            type="text"
            placeholder="e.g. RAMESH KUMAR"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 uppercase font-medium"
          />
        </div>

        <div className="md:col-span-2 flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            <span className="font-telugu text-base">Calculate Now (గణించండి)</span>
          </button>

          {result && (
            <button
              type="button"
              onClick={() => { setResult(null); setDob(''); setFullName(''); }}
              className="px-4 py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {result && (
        <div className="mt-6 pt-6 border-t border-slate-200 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-md">
                  {result.lifePath}
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-blue-700">Life Path Number</span>
                  <h4 className="text-xl font-bold text-slate-900 font-telugu">{result.info?.title}</h4>
                </div>
              </div>

              {result.nameNumber && (
                <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-center">
                  <span className="text-xs text-blue-700 font-semibold block">Name Number</span>
                  <span className="text-2xl font-bold text-blue-900">{result.nameNumber}</span>
                </div>
              )}
            </div>

            <div className="space-y-3 text-slate-700 font-medium">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900">Ruling Planet (గ్రహం): </strong>
                  <span>{result.info?.planet}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900">Key Personality (స్వభావం): </strong>
                  <span className="font-telugu">{result.info?.traits}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900">Lucky Colors (అదృష్ట రంగులు): </strong>
                  <span>{result.info?.luckyColors}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900">Lucky Days (అనుకూల రోజులు): </strong>
                  <span>{result.info?.luckyDays}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
