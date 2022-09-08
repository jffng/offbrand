const vertexShader = `
    attribute vec2 a_vertex;

    void main(void) {
        gl_Position = vec4(a_vertex, 0.0, 1.0);
    }
`

// test shader:
// const vertexShader = `
//     varying vec2 vUv;

//     void main() {
//     vUv = uv;
//     vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//     vec4 viewPosition = viewMatrix * modelPosition;
//     vec4 projectedPosition = projectionMatrix * viewPosition;

//     gl_Position = projectedPosition;
//     }
// `;

export default vertexShader;