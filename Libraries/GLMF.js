class GLMF
{
    static identity4x4(output)
    {
        for(let i=0; i < output.length; i++)
        {
            output[i] = 0;
        }

        output[0] = 1;
        output[5] = 1;
        output[10] = 1;
        output[15] = 1;
    }

    static zero(output)
    {
        for(let i=0; i < output.length; i++)
        {
            output[i] = 0;
        }
    }

    static translate(output, input, v)
    {
        if(output !== input)
        {
            output[0] = input[0];
            output[1] = input[1];
            output[2] = input[2];
            output[3] = input[3];
            output[4] = input[4];
            output[5] = input[5];
            output[6] = input[6];
            output[7] = input[7];
            output[8] = input[8];
            output[9] = input[9];
            output[10] = input[10];
            output[11] = input[11];
        }

        output[12] = input[0] * v[0] + input[4] * v[1] + input[8] * v[2] + input[12];
        output[13] = input[1] * v[0] + input[5] * v[1] + input[9] * v[2] + input[13];
        output[14] = input[2] * v[0] + input[6] * v[1] + input[10] * v[2] + input[14];
        output[15] = input[3] * v[0] + input[7] * v[1] + input[11] * v[2] + input[15];
    }

    static rotateX(output, input, angle)
    {
        GLMF.rotate(output, input, angle, [1, 0, 0]);
    }

    static rotateY(output, input, angle)
    {
        GLMF.rotate(output, input, angle, [0, 1, 0]);
    }

    static rotateZ(output, input, angle)
    {
        GLMF.rotate(output, input, angle, [0, 0, 1]);
    }

    static rotate(output, input, angle, v)
    {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        let ro11 = cos + Math.pow(v[0], 2) * (1 - cos);
        let ro12 = v[0] * v[1] * (1 - cos) - v[2] * sin;
        let ro13 = v[0] * v[2] * (1 - cos) + v[1] * sin;
        // ro14 = 0;
        let ro21 = v[1] * v[0] * (1 - cos) + v[2] * sin;
        let ro22 = cos + Math.pow(v[1], 2) * (1 - cos);
        let ro23 = v[1] * v[2] * (1 - cos) - v[0] * sin;
        // ro24 = 0;
        let ro31 = v[2] * v[0] * (1 - cos) - v[1] * sin;
        let ro32 = v[2] * v[1] * (1 - cos) + v[0] * sin;
        let ro33 = cos + Math.pow(v[2], 2) * (1 - cos);
        // ro34 = 0;
        // ro41 = 0;
        // ro42 = 0;
        // ro43 = 0;
        // ro44 = 1;

        let in11 = input[0];
        let in12 = input[4];
        let in13 = input[8];
        // in14 not necessary, because it will never change 
        let in21 = input[1];
        let in22 = input[5];
        let in23 = input[9];
        // in24 not necessary, because it will never change 
        let in31 = input[2];
        let in32 = input[6];
        let in33 = input[10];
        // in34 not necessary, because it will never change 
        let in41 = input[3];
        let in42 = input[7];
        let in43 = input[11];
        // in44 not necessary, because it will never change 

        output[0] = in11 * ro11 + in12 * ro21 + in13 * ro31;
        output[1] = in21 * ro11 + in22 * ro21 + in23 * ro31;
        output[2] = in31 * ro11 + in32 * ro21 + in33 * ro31;
        output[3] = in41 * ro11 + in42 * ro21 + in43 * ro31;

        output[4] = in11 * ro12 + in12 * ro22 + in13 * ro32;
        output[5] = in21 * ro12 + in22 * ro22 + in23 * ro32;
        output[6] = in31 * ro12 + in32 * ro22 + in33 * ro32;
        output[7] = in41 * ro12 + in42 * ro22 + in43 * ro32;

        output[8] = in11 * ro13 + in12 * ro23 + in13 * ro33;
        output[9] = in21 * ro13 + in22 * ro23 + in23 * ro33;
        output[10] = in31 * ro13 + in32 * ro23 + in33 * ro33;
        output[11] = in41 * ro13 + in42 * ro23 + in43 * ro33;

        if(output !== input)
        {
            output[12] = input[12];
            output[13] = input[13];
            output[14] = input[14];
            output[15] = input[15];
        }
    }

    static scale(output, input, v)
    {
        output[0] = input[0] * v[0];
        output[1] = input[1] * v[0];
        output[2] = input[2] * v[0];
        output[3] = input[3] * v[0];
        output[4] = input[4] * v[1];
        output[5] = input[5] * v[1];
        output[6] = input[6] * v[1];
        output[7] = input[7] * v[1];
        output[8] = input[8] * v[2];
        output[9] = input[9] * v[2];
        output[10] = input[10] * v[2];
        output[11] = input[11] * v[2];

        if(output !== input)
        {
            output[12] = input[12];
            output[13] = input[13];
            output[14] = input[14];
            output[15] = input[15];
        }
    }

    static lookAt(output, eye, look, up)
    {
        let n0 = eye[0] - look[0];
        let n1 = eye[1] - look[1];
        let n2 = eye[2] - look[2];

        let u0 = up[1] * n2 - up[2] * n1;
        let u1 = up[2] * n0 - up[0] * n2;
        let u2 = up[0] * n1 - up[1] * n0;

        let v0 = n1 * u2 - n2 * u1;
        let v1 = n2 * u0 - n0 * u2;
        let v2 = n0 * u1 - n1 * u0;

        let nLength = GLMF.getVLength(n0, n1, n2);
        let uLength = GLMF.getVLength(u0, u1, u2);
        let vLength = GLMF.getVLength(v0, v1, v2);

        let nn0 = nLength * n0;
        let nn1 = nLength * n1;
        let nn2 = nLength * n2;

        let nu0 = uLength * u0;
        let nu1 = uLength * u1;
        let nu2 = uLength * u2;

        let nv0 = vLength * v0;
        let nv1 = vLength * v1;
        let nv2 = vLength * v2;

        let tx = -nu0 * eye[0] + -nu1 * eye[1] + -nu2 * eye[2];
        let ty = -nv0 * eye[0] + -nv1 * eye[1] + -nv2 * eye[2];
        let tz = -nn0 * eye[0] + -nn1 * eye[1] + -nn2 * eye[2];

        output[0] = nu0;
        output[1] = nv0;
        output[2] = nn0;
        output[3] = 0;
        output[4] = nu1;
        output[5] = nv1;
        output[6] = nn1;
        output[7] = 0;
        output[8] = nu2;
        output[9] = nv2;
        output[10] = nn2;
        output[11] = 0;
        output[12] = tx;
        output[13] = ty;
        output[14] = tz;
        output[15] = 1;

        return output;
    }

    static perspective(output, fovy, aspect, near, far)
    {
        let f = 1.0 / Math.tan(fovy / 2);
        let nf = 1 / (near - far);
        
        output[0] = f / aspect;
        output[1] = 0;
        output[2] = 0;
        output[3] = 0;
        output[4] = 0;
        output[5] = f;
        output[6] = 0;
        output[7] = 0;
        output[8] = 0;
        output[9] = 0;
        output[10] = (far + near) * nf;
        output[11] = -1;
        output[12] = 0;
        output[13] = 0;
        output[14] = 2 * far * near * nf;
        output[15] = 0;
    }

    static toRadian(degree)
    {
        return degree * Math.PI / 180;
    }

    static getVLength(v0, v1, v2)
    {
        return (1 / (Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2)));
    }

    static matrix4ToMatrix3Invert(output, input) {
        const determinante = input[0] * input[5] * input[10] - input[0] * input[9] * input[6] - input[4] * input[1] * input[10] + input[4] * input[9] * input[2] + input[8] * input[1] * input[6] - input[8] * input[5] * input[2];
        output[0] = (input[5] * input[10] - input[9] * input[6]) / determinante;
		output[1] = (input[9] * input[2] - input[1] * input[10]) / determinante;
		output[2] = (input[1] * input[6] - input[5] * input[2]) / determinante;
		output[3] = (input[8] * input[6] - input[4] * input[10]) / determinante;
		output[4] = (input[0] * input[10] - input[8] * input[2]) / determinante;
		output[5] = (input[4] * input[2] - input[0] * input[6]) / determinante;
		output[6] = (input[4] * input[9] - input[8] * input[5]) / determinante;
		output[7] = (input[8] * input[1] - input[0] * input[9]) / determinante;
		output[8] = (input[0] * input[5] - input[4] * input[1]) / determinante;

        return output;
    }

    static transformV3(vector, matrix) {
        const c = Float32Array.from(vector);
		vector[0] = matrix[0]*c[0] + matrix[3]*c[1] + matrix[6]*c[2];
		vector[1] = matrix[1]*c[0] + matrix[4]*c[1] + matrix[7]*c[2];
		vector[2] = matrix[2]*c[0] + matrix[5]*c[1] + matrix[8]*c[2];

        return vector;
    }

    static identity3x3(output) {
        for(let i=0; i < output.length; i++)
        {
            output[i] = 0;
        }

        output[0] = 1;
        output[4] = 1;
        output[8] = 1;
    }
}