interface ModeSelectorProps {
    current: string,
    onChange?: (selectType:string) => void;
    children?: React.ReactNode;
  
  };
  
  
  const ModeSelector: React.FC<ModeSelectorProps> = ( { current, onChange }: ModeSelectorProps ) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px'}}>
        <div className="fc fc-direction-ltr">
          <div className="fc-button-group">
            <button
              className={`fc-button fc-button-primary ${current === 'week' ? 'fc-button-active' : ''}`}
              type="button"
              onClick={() => onChange ? onChange('week') : () => {} }
            >
              week
            </button>
            <button
              className={`fc-button fc-button-primary ${current === '2weeks' ? 'fc-button-active' : ''}`}
              type="button"
              onClick={() => onChange ? onChange('2weeks') : () => {} }
            >
              2 weeks
            </button>
            <button
              className={`fc-button fc-button-primary ${current === 'month' ? 'fc-button-active' : ''}`}
              type="button"
              onClick={() => onChange ? onChange('month') : () => {} }
            >
              month
            </button>
            <button
              className={`fc-button fc-button-primary ${current === 'year' ? 'fc-button-active' : ''}`}
              type="button"
              onClick={() => onChange ? onChange('year') : () => {} }
            >
              year
            </button>
          </div>
        </div>
      </div>
    )
  };
  
  export default ModeSelector;
  
  