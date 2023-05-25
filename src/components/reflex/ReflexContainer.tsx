import './reflex.css';

import {
    ReflexContainer as Container
    } from 'react-reflex';

    export interface ReflexContainerProps extends React.ComponentPropsWithoutRef<typeof Container> {
      }

      export function ReflexContainer(props: ReflexContainerProps) {
        const { ...rest } = props;
        // do something with specialProp
        return <Container {...rest} />;
      }    
      
      export default ReflexContainer;
