import { useThree } from '@react-three/fiber' //i had to re install this..idk why
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);

      controls.minDistance = 0.5;
      controls.maxDistance = 10;
      return () => {
        controls.dispose();
      };
    },
    [camera, gl]
  );
  return null;
};

export default CameraController;