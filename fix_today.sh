sed -i '/export default function App() {/a\
  const [todayItinerary, setTodayItinerary] = React.useState<typeof ITINERARY_DAYS[0] | undefined>(undefined);\
\
  React.useEffect(() => {\
    const todayStr = new Date().toISOString().split('\''T'\'')[0];\
    let match = ITINERARY_DAYS.find(d => d.fullDate === todayStr);\
    if (!match && new Date() < new Date('\''2026-09-15'\'')) {\
      match = ITINERARY_DAYS[0];\
    }\
    setTodayItinerary(match);\
  }, []);\
' src/App.tsx

sed -i '/{\/\* Offline Alert Prompt \*\//i\
            <TodayBriefing todayItinerary={todayItinerary} onJump={jumpToDay} />\
' src/App.tsx
