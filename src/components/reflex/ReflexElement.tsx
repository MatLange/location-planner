import {
    ReflexElement as Element
    } from 'react-reflex';

    export interface ReflexElementProps extends React.ComponentPropsWithoutRef<typeof Element> {
      }

      export function ReflexElement(props: ReflexElementProps) {
        const { ...rest } = props;
        // do something with specialProp
        return <Element {...rest} />;
      }    
      
      export default ReflexElement;
