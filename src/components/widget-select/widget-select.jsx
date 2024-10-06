import { useState, useEffect } from 'react'
import { checkIcon } from '../../assets/svgs'
import "./widget-select.css"

export default function WidgetSelector({setCurrentWidget}) {
  const [widgetList, setWidgetList] = useState([])
  const [selectedWidget, setSelectedWidget] = useState()

  useEffect(() => {
    fetch('./widgets.json')
      .then((response) => response.json())
      .then((data) => {
        const processedData = Object.entries(data).map(([widgetId, widgetData]) => ({
          id: widgetId,
          ...widgetData,
        }));
        setWidgetList(processedData);
        setSelectedWidget(processedData[0].id)
        setCurrentWidget(processedData[0])
      })
  }, []);

  const WidgetSelection = ({placeholderImg, id, widgetData}) => {
    const handleClick = () => {
      if (!(selectedWidget === id)) {
        setSelectedWidget(id)
        setCurrentWidget(widgetData)
      }
    }

    return (
      <div className="widget-selection" style={selectedWidget === id ? { cursor: "default" } : null} onClick={handleClick}>
        <img className="widget-img" src={placeholderImg} alt="" draggable={false}/>
        {selectedWidget === id && <div className="widget-selected">{checkIcon}</div>}
      </div>
    )
  }

  return (
    <div className="widgets-container">
      {widgetList.map((widget) => (
        <WidgetSelection
          key={widget.id}
          id={widget.id}
          widgetData={widget}
          placeholderImg={widget.placeholderImg}
        />
      ))}
    </div>
  )
}