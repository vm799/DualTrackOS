import React from 'react';
import useStore from '../store/useStore';
import useCycleStore from '../store/useCycleStore';
import InfoTooltip from './InfoTooltip';

const MojoCycleChart = () => {
    const darkMode = useStore((state) => state.darkMode);
    const { cycleDay, cycleLength } = useCycleStore();

    const totalDays = cycleLength || 28;
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    // Mojo curve function scaled to user's cycle length
    // Phase boundaries scale proportionally with cycle length
    const getMojoValue = (day) => {
        const ratio = day / totalDays;
        if (ratio <= 0.18) return 70 + (ratio / 0.18) * 28; // Menstrual → early follicular rise
        if (ratio <= 0.50) return 70 + ((ratio - 0.18) / 0.32) * 28; // Follicular rise
        if (ratio <= 0.57) return 98; // Peak (Ovulation)
        if (ratio <= 0.86) return 98 - ((ratio - 0.57) / 0.29) * 48; // Luteal gradual dip
        return 50; // Late luteal / menstrual floor
    };

    const width = 400;
    const height = 150;
    const padding = 20;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);

    const points = days.map(day => {
        const x = padding + (day - 1) * (chartWidth / (totalDays - 1));
        const y = height - padding - (getMojoValue(day) / 100 * chartHeight);
        return `${x},${y}`;
    }).join(' ');

    const clampedDay = Math.min(cycleDay, totalDays);
    const currentX = padding + (clampedDay - 1) * (chartWidth / (totalDays - 1));
    const currentY = height - padding - (getMojoValue(clampedDay) / 100 * chartHeight);

    return (
        <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800/40 border border-purple-500/20' : 'bg-white border border-purple-100'}`}>
            <h4 className={`text-xs font-bold uppercase mb-4 tracking-wider flex items-center gap-1 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                Mojo Trend vs. Cycle Phase
                <InfoTooltip
                    title="Reading This Chart"
                    text={`This chart shows your predicted energy ('Mojo') across your ${totalDays}-day cycle. The pink dot marks today. The curve rises during your follicular phase (building energy), peaks at ovulation, then dips during the luteal phase. Use this to plan ahead — schedule demanding tasks when the curve is high, and rest/recovery when it dips.`}
                    darkMode={darkMode}
                    dismissKey="mojo-chart"
                    size={12}
                />
            </h4>

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                {/* Zones Background */}
                <rect x={padding} y={padding} width={chartWidth / 2} height={chartHeight} fill={darkMode ? '#9d174d10' : '#fdf2f8'} rx="4" />
                <rect x={padding + chartWidth / 2} y={padding} width={chartWidth / 2} height={chartHeight} fill={darkMode ? '#312e8110' : '#eef2ff'} rx="4" />

                {/* Labels */}
                <text x={padding + 5} y={height - 5} fontSize="8" fill={darkMode ? '#9ca3af' : '#6b7280'}>Follicular (Power)</text>
                <text x={width - padding - 80} y={height - 5} fontSize="8" fill={darkMode ? '#9ca3af' : '#6b7280'}>Luteal (Gentle)</text>

                {/* Mojo Line */}
                <polyline
                    fill="none"
                    stroke={darkMode ? '#d946ef' : '#a855f7'}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                    style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.2))' }}
                />

                {/* Current Position Marker */}
                <g>
                    <line
                        x1={currentX} y1={padding} x2={currentX} y2={height - padding}
                        stroke={darkMode ? '#ffffff40' : '#00000040'}
                        strokeDasharray="4 2"
                    />
                    <circle
                        cx={currentX} cy={currentY} r="6"
                        fill={darkMode ? '#f472b6' : '#ec4899'}
                        className="animate-pulse"
                    />
                    <text
                        x={currentX} y={currentY - 10}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill={darkMode ? '#fff' : '#000'}
                    >
                        Today
                    </text>
                </g>
            </svg>

            <div className="flex justify-between mt-2 px-4">
                <span className="text-[10px] text-pink-400 font-bold">Building Phase</span>
                <span className="text-[10px] text-indigo-400 font-bold">Restoring Phase</span>
            </div>
        </div>
    );
};

export default MojoCycleChart;
