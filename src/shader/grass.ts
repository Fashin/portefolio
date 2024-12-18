export const grassVertexShader = `
varying vec2 vUv;
uniform float time;

void main() {
    vUv = uv;

    // Simulation de vent avec sinus sur les sommets
    float wave = sin(position.x * 5.0 + time) * 0.2;
    vec3 transformed = position + normal * wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`

export const grassFragmentShader = `
varying vec2 vUv;

void main() {
    // Gradient de couleur pour l'herbe
    vec3 grassColor = mix(vec3(0.15, 0.4, 0.15), vec3(0.25, 0.6, 0.25), vUv.y);
    gl_FragColor = vec4(grassColor, 1.0);
}
`