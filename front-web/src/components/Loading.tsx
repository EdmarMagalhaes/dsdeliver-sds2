// src/components/Loading.tsx
import { Hourglass } from 'react-loader-spinner';

function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
      <Hourglass
        visible={true}
        height="60"
        width="60"
        ariaLabel="hourglass-loading"
        wrapperStyle={{}}
        wrapperClass=""
        colors={['#3f51b5', '#1976d2']}
      />
    </div>
  );
}

export default Loading;
