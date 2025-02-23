import { useState, useEffect, useRef } from 'react'
import MatchArticle from './components/match-article/match-article';
import LogoAnimation from './components/logo-animation/logo-animation';
import WidgetSelector from './components/widget-select/widget-select';
import { dlIcon, zmitoLogo } from './assets/svgs'
import logo from "/logo.svg"

const today = new Date();

export default function App() {
  const [dayValue, setDayValue] = useState(String(today.getDate() + 1).padStart(2, '0')+"/"+String(today.getMonth() + 1).padStart(2, '0'));
  const [selectedLists, setSelectedLists] = useState(["emea"]);
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
          if (selectedLists.includes(region)) {
            for (const teamId in data[region]) {
              filteredTeams.push(data[region][teamId]);
            }
          }
        }
        setTeams(filteredTeams);
      });
  }, [selectedLists]);

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
      if (selectedLists.length === 1 && !event.target.checked) return;
      const updatedRegions = selectedLists.includes(value)
        ? selectedLists.filter(region => region !== value)
        : [...selectedLists, value];
      setSelectedLists(updatedRegions);
    };

    // const [isSelected, setIsSelected] = useState(selectedLists.includes(id))

    return (
      <div className="">
        <input className="tl-checkboxd" type="checkbox" id={id + "-cb"} value={id} checked={selectedLists.includes(id)} onChange={handleCheckboxChange}/>
        {/* <div className="tl-checkbox"></div> */}
        <label className="tl-label" htmlFor={id + "-cb"}>{label}</label>
      </div>
    )
  }

  const handleHourChange = (matchId, newValue) => {
    setMatchInfo(prevMatchInfo => ({
      ...prevMatchInfo,
      [matchId]: {
        ...prevMatchInfo[matchId],
        ["hour"]: newValue
      }
    }));
  };

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

    bg.src = currentWidget.match2.widgetImg;
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

    const drawPositions = currentWidget.match2.positions
    ctx.drawImage(bg, 0, 0, canvas.current.width, canvas.current.height);
    ctx.fillText(dayValue, drawPositions.title[0], drawPositions.title[1]);
    ctx.drawImage(m1t1, drawPositions.m1_t1[0], drawPositions.m1_t1[1], drawPositions.m1_t1[2], drawPositions.m1_t1[3]);
    ctx.drawImage(m1t2, drawPositions.m1_t2[0], drawPositions.m1_t2[1], drawPositions.m1_t2[2], drawPositions.m1_t2[3]);
    ctx.drawImage(m2t1, drawPositions.m2_t1[0], drawPositions.m2_t1[1], drawPositions.m2_t1[2], drawPositions.m2_t1[3]);
    ctx.drawImage(m2t2, drawPositions.m2_t2[0], drawPositions.m2_t2[1], drawPositions.m2_t2[2], drawPositions.m2_t2[3]);

    console.log(drawPositions.hour1)

    ctx.font = '700 48px "Chakra Petch"';
    if (drawPositions.hour1 !== null) {
      ctx.fillText(matchInfo.match1.hour, drawPositions.hour1[0], drawPositions.hour1[1]);
    }
    if (drawPositions.hour2 !== null) {
      ctx.fillText(matchInfo.match2.hour, drawPositions.hour2[0], drawPositions.hour2[1]);
    }

  };

  const handleCanvasDl = () => {
    const dataURL = canvas.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `vct-widget-${matchInfo.match1.team1}-${matchInfo.match2.team1}.png`;
    a.click();
  };

  return (
    <div className="main">
      <LogoAnimation />
      <div className="options">
        <div className="title">
          <img src={logo} alt="Web logo" />
        </div>
        <div className="options-list">
          <div className="options-group">
            <h2 className="option-label">Match Day:</h2>
            <input className="input" type="text" placeholder="Match Day" value={dayValue} onChange={(e) => setDayValue(e.target.value)} />
          </div>
          <div className="options-group">
            <h2 className="option-label">Team lists:</h2>
            <ul className="teams-list">
              <TeamListSelect id="emea" label="VCT Emea" />
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
              dhour={matchInfo.match1.hour}
              onMatchHourChange={(value) => handleHourChange("match1", value)}
              teams={teams}
              dteam1={matchInfo.match1.team1} 
              dteam2={matchInfo.match1.team2}
              onTeamChange={(team, value) => handleTeamChange("match1", team, value)}
              defaultChecked 
            />
            <MatchArticle 
              id="match2" 
              label="Second Match" 
              dhour={matchInfo.match2.hour}
              onMatchHourChange={(value) => handleHourChange("match2", value)}
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
      <a className="info" href="https://links.zmito.eu" target="_blank">
        <p className="info-text">Created by </p>
        {zmitoLogo}
      </a>
    </div>
  )
}