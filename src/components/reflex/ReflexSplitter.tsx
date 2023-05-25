import {
    ReflexSplitter as Splitter
    } from 'react-reflex';

    export interface ReflexSplitterProps extends React.ComponentPropsWithoutRef<typeof Splitter> {
      }

      export function ReflexSplitter(props: ReflexSplitterProps) {
        const { ...rest } = props;
        // do something with specialProp
        return <Splitter {...rest} />;
      }    
      
      export default ReflexSplitter;
