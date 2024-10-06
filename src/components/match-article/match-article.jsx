import { useState } from "react"
import "./match-article.css"

export default function MatchArticle({id, label, matchHour, defaultChecked, teams, dteam1, dteam2, onTeamChange}) {
  const [matchEnabled, setMatchEnabled] = useState(defaultChecked)
  const [team1, setTeam1] = useState(dteam1)
  const [team2, setTeam2] = useState(dteam2)

  const handleTeam1Change = (e) => {
    setTeam1(e.target.value);
    onTeamChange("team1", e.target.value);
  };

  const handleTeam2Change = (e) => {
    setTeam2(e.target.value);
    onTeamChange("team2", e.target.value);
  };

  return (
    <div className="match-container">
      <input className="tl-checkbox" type="checkbox" id={id + "-cb"} defaultChecked={defaultChecked} onChange={() => setMatchEnabled(!matchEnabled)}/>
      <label className="tl-label" htmlFor={id + "-cb"}>{label}</label>
      <article style={{margin:"0 0 10px 0"}}>
        {!matchEnabled && <div className="match-disabled"></div>}
        <input className="input" type="text" placeholder="day-input" defaultValue={matchHour} />
        <div style={{marginTop:"10px", width:"100%", display:"flex", justifyContent:"center"}}>
          <div className="team-selector">
            <div className="team-img">
              <img src={`/teams/${team1}.png`} alt="" />
            </div>
            <p className="team-name">{team1}</p>
            <select className="team-selector-input" onChange={handleTeam1Change}>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          <p className="match-vs-text">VS.</p>
          <div className="team-selector">
            <div className="team-img">
              <img src={`/teams/${team2}.png`} alt="" />
            </div>
            <p className="team-name">{team2}</p>
            <select className="team-selector-input" onChange={handleTeam2Change}>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        </div>
      </article>
    </div>
  )
}