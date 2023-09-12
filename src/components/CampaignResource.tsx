interface TAProps {
    label: string,
    children?: React.ReactNode;
  
  };
  
  export const TA: React.FC<TAProps> = ( { label }: TAProps ) => {
    return (
      <span style={{
        backgroundColor: '#0868ac',
        borderRadius: 10,
        padding: 5,
        color: 'white',
        fontSize: 'small',
      }}>
        { label }
      </span>
    );
  };
  
  
  interface CampaignResourceProps {
    resource: any,
    children?: React.ReactNode;
  
  };
  
  
  const CampaignResource: React.FC<CampaignResourceProps> = ( props: CampaignResourceProps ) => {
    const resource = props.resource;
      const { name, from, to, type } = resource.extendedProps;
      if (type === 'steps') return <span>Steps</span>;
      return (
        <div style={{
          display: 'inline-flex',
          justifyContent: 'space-between',
          width: '100%',
          paddingRight: '20px'
        }}>
          <div>
            { name }
            &nbsp;
          </div>
          <div>
              <TA label={type} />
          </div>
        </div>
      );
  };
  
  export default CampaignResource;
  
  