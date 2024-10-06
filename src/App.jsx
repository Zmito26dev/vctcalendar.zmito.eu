import { useState, useEffect, useRef } from 'react'
import MatchArticle from './components/match-article/match-article';
import LogoAnimation from './components/logo-animation/logo-animation';
import WidgetSelector from './components/widget-select/widget-select';
import { dlIcon, vctIcon } from './assets/svgs'

const today = new Date();

export default function App() {
  const [dayValue, setDayValue] = useState(String(today.getDate() + 1).padStart(2, '0')+"/"+String(today.getMonth() + 1).padStart(2, '0'));
  const [selectedRegions, setSelectedRegions] = useState(["emea"]);
  const [teams, setTeams] = useState([]);
  const [currentWidget, setCurrentWidget] = useState({});

  const canvas = useRef(null)
  const [matchInfo, setMatchInfo] = useState({
    match1: { hour: "10:00", team1: "TH", team2: "GEN" },
    match2: { hour: "13:00", team1: "KOI", team2: "GX" },
  });
  
  useEffect(() => {
    fetch('./teams.json')
      .then((response) => response.json())
      .then((data) => {
        const filteredTeams = [];
        for (const region in data) {
          if (selectedRegions.includes(region)) {
            for (const teamId in data[region]) {
              filteredTeams.push(data[region][teamId]);
            }
          }
        }
        setTeams(filteredTeams);
      });
  }, [selectedRegions]);

  useEffect(() => {
    const ctx = canvas.current.getContext('2d');
    const bg = new Image();
    bg.src = currentWidget.placeholderImg;

    bg.onload = () => {
      ctx.drawImage(bg, 0, 0, canvas.current.width, canvas.current.height);
    };
  }, [currentWidget]);

  const TeamListSelect = ({id, label}) => {
    const handleCheckboxChange = (event) => {
      const { value } = event.target;
      if (selectedRegions.length === 1 && !event.target.checked) return;
      const updatedRegions = selectedRegions.includes(value)
        ? selectedRegions.filter(region => region !== value)
        : [...selectedRegions, value];
      setSelectedRegions(updatedRegions);
    };

    return (
      <li>
        <input className="tl-checkbox" type="checkbox" id={id + "-cb"} value={id} checked={selectedRegions.includes(id)} onChange={handleCheckboxChange}/>
        <label className="tl-label" htmlFor={id + "-cb"}>{label}</label>
      </li>
    )
  }

  const handleTeamChange = (matchId, team, newValue) => {
    setMatchInfo(prevMatchInfo => ({
      ...prevMatchInfo,
      [matchId]: {
        ...prevMatchInfo[matchId],
        [team]: newValue
      }
    }));
  };
  
  const handleCanvasGeneration = async () => {
    const ctx = canvas.current.getContext('2d');
    const bg = new Image();
    const m1t1 = new Image();
    const m1t2 = new Image();
    const m2t1 = new Image();
    const m2t2 = new Image();

    ctx.font = '700 128px "Chakra Petch"';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    bg.src = currentWidget.match1.widgetImg;
    m1t1.src = `/teams/${matchInfo.match1.team1}.png`;
    m1t2.src = `/teams/${matchInfo.match1.team2}.png`;
    m2t1.src = `/teams/${matchInfo.match2.team1}.png`;
    m2t2.src = `/teams/${matchInfo.match2.team2}.png`;

    await Promise.all([
      new Promise(resolve => bg.onload = resolve),
      new Promise(resolve => m1t1.onload = resolve),
      new Promise(resolve => m1t2.onload = resolve),
      new Promise(resolve => m2t1.onload = resolve),
      new Promise(resolve => m2t2.onload = resolve)
    ]);

    ctx.drawImage(bg, 0, 0, canvas.current.width, canvas.current.height);
    ctx.fillText(dayValue, 500, 322);
    ctx.drawImage(m1t1, 225, 427, 160, 160);
    ctx.drawImage(m1t2, 614, 427, 160, 160);
    ctx.drawImage(m2t1, 225, 677, 160, 160);
    ctx.drawImage(m2t2, 614, 677, 160, 160);
  };

  const handleCanvasDl = () => {
    const dataURL = canvas.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'download.png';
    a.click();
  };

  return (
    <div className="main">
      <LogoAnimation />
      <div className="options">
        <div className="title">
          {vctIcon}
          <h1 className="title-text">MATCH WIDGET GENERATOR</h1>
        </div>
        <div className="options-list">
          <div className="options-group">
            <h2 className="option-label">Match Day:</h2>
            <input className="input" type="text" placeholder="Match Day" value={dayValue} onChange={(e) => setDayValue(e.target.value)} />
          </div>
          <div className="options-group">
            <h2 className="option-label">Team lists:</h2>
            <ul className="teams-list">
              <TeamListSelect id="emea" label="VCT Emea"/>
              <TeamListSelect id="americas" label="VCT Americas" />
              <TeamListSelect id="pacific" label="VCT Pacific" />
              <TeamListSelect id="china" label="VCT China" />
            </ul>
          </div>
          <div className="options-group">
            <h2 className="option-label">Matches:</h2>
            <MatchArticle 
              id="match1" 
              label="First Match" 
              matchHour={matchInfo.match1.hour} 
              teams={teams} 
              dteam1={matchInfo.match1.team1} 
              dteam2={matchInfo.match1.team2}
              onTeamChange={(team, value) => handleTeamChange("match1", team, value)}
              defaultChecked 
            />
            <MatchArticle 
              id="match2" 
              label="Second Match" 
              matchHour={matchInfo.match2.hour} 
              teams={teams} 
              dteam1={matchInfo.match2.team1} 
              dteam2={matchInfo.match2.team2}
              onTeamChange={(team, value) => handleTeamChange("match2", team, value)}
              defaultChecked
            />
          </div>
          <div className="options-group">
            <h2 className="option-label">Widget style:</h2>
            <WidgetSelector setCurrentWidget={setCurrentWidget}/>
          </div>
          <div className="generate-button-container">
            <button className="generate-button" onClick={handleCanvasGeneration}>Generate Widget</button>
          </div>
        </div>
      </div>
      <div className="canvas-container">
        <div className="downloadable-canvas" width={1000} height={1000}>
          <div className="dl-button-container">
            <button className="dl-button" onClick={handleCanvasDl}>{dlIcon}</button>
          </div>
          <canvas className="canvas" ref={canvas} width={1000} height={1000}></canvas>
        </div>
      </div>
    </div>
  )
}