// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020

class Cuboid extends GLObject
{
    constructor(localPosition, localRotation, localScale, vertices, faces, wireframe)
    {
        super(localPosition, localRotation, localScale, vertices, faces, wireframe);
    }

    // Creates a cube with given dimensions (3D) at given position.
    // The pivot is located at the center of the cube.
    static createBasic(dimensions, lineColor, faceColor)
    {
        let d = dimensions;
        let v = [];

        // Half width
        let hw = d[0]/2;
        // Half hight
        let hh = d[1]/2;
        // Half depth
        let hd = d[2]/2;

        v.push(new Vertex(new Vector3(-hw, -hh, +hd), 0));
        v.push(new Vertex(new Vector3(+hw, -hh, +hd), 1));
        v.push(new Vertex(new Vector3(+hw, -hh, -hd), 2));
        v.push(new Vertex(new Vector3(-hw, -hh, -hd), 3));
        v.push(new Vertex(new Vector3(-hw, +hh, +hd), 4));
        v.push(new Vertex(new Vector3(+hw, +hh, +hd), 5));
        v.push(new Vertex(new Vector3(+hw, +hh, -hd), 6));
        v.push(new Vertex(new Vector3(-hw, +hh, -hd), 7));

        let triangulation = Triangulation.createEmpty();
        triangulation.combine(Triangulation.triangulateFour([v[0], v[1], v[2], v[3]]));
        triangulation.combine(Triangulation.triangulateFour([v[0], v[4], v[5], v[1]]));
        triangulation.combine(Triangulation.triangulateFour([v[1], v[5], v[6], v[2]]));
        triangulation.combine(Triangulation.triangulateFour([v[2], v[6], v[7], v[3]]));
        triangulation.combine(Triangulation.triangulateFour([v[3], v[7], v[4], v[0]]));
        triangulation.combine(Triangulation.triangulateFour([v[4], v[7], v[6], v[5]]));
        
        let result = Cuboid.create(v, triangulation, lineColor, faceColor);
        result.removeDoubleLines();
        return result;
    }

    static createDoubleLined(dimensions, lineColor, faceColor)
    {
        let d = dimensions;
        let t = Triangulation.createEmpty();
        let v = [];

        // Half width
        let hw = d[0]/2;
        // Half hight
        let hh = d[1]/2;
        // Half depth
        let hd = d[2]/2;

        // Front
        v.push(new Vertex(new Vector3(-hw, -hh, +hd), v.length));
        v.push(new Vertex(new Vector3(+hw, -hh, +hd), v.length));
        v.push(new Vertex(new Vector3(+hw, +hh, +hd), v.length));
        v.push(new Vertex(new Vector3(-hw, +hh, +hd), v.length));
        setNormal(new Vector3(0,0,1));
        tiangulate();

        // Back
        v.push(new Vertex(new Vector3(-hw, +hh, -hd), v.length));
        v.push(new Vertex(new Vector3(+hw, +hh, -hd), v.length));
        v.push(new Vertex(new Vector3(+hw, -hh, -hd), v.length));
        v.push(new Vertex(new Vector3(-hw, -hh, -hd), v.length));
        setNormal(new Vector3(0,0,-1));
        tiangulate();

        //Top
        v.push(new Vertex(new Vector3(-hw, +hh, +hd), v.length));
        v.push(new Vertex(new Vector3(+hw, +hh, +hd), v.length));
        v.push(new Vertex(new Vector3(+hw, +hh, -hd), v.length));
        v.push(new Vertex(new Vector3(-hw, +hh, -hd), v.length));
        setNormal(new Vector3(0,1,0));
        let l = v.length;
        tiangulate();

        //Bottom
        v.push(new Vertex(new Vector3(-hw, -hh, -hd), v.length));
        v.push(new Vertex(new Vector3(+hw, -hh, -hd), v.length));
        v.push(new Vertex(new Vector3(+hw, -hh, +hd), v.length));
        v.push(new Vertex(new Vector3(-hw, -hh, +hd), v.length));
        setNormal(new Vector3(0,-1,0));
        tiangulate();

        //Right
        v.push(new Vertex(new Vector3(+hw, -hh, +hd), v.length));
        v.push(new Vertex(new Vector3(+hw, -hh, -hd), v.length));
        v.push(new Vertex(new Vector3(+hw, +hh, -hd), v.length));
        v.push(new Vertex(new Vector3(+hw, +hh, +hd), v.length));
        setNormal(new Vector3(1,0,0));
        tiangulate();
        
        //Left
        v.push(new Vertex(new Vector3(-hw, -hh, -hd), v.length));
        v.push(new Vertex(new Vector3(-hw, -hh, +hd), v.length));
        v.push(new Vertex(new Vector3(-hw, +hh, +hd), v.length));
        v.push(new Vertex(new Vector3(-hw, +hh, -hd), v.length));
        setNormal(new Vector3(-1,0,0));
        tiangulate();

        function tiangulate()
        {
            let l = v.length;
            t.combine(Triangulation.triangulateFour([v[l-4], v[l-1], v[l-2], v[l-3]]));
        }

        function setNormal(normal)
        {
            let l = v.length;
            for(let i = 1; i<=4; i++)
            {
                v[l-i].normal = normal;
            }
        }

        //console.log(v);
        let result = Cuboid.create(v, t, lineColor, faceColor);
        return result;
    }

    static create(vertices, triangulation, lineColor, faceColor)
    {
        let result = new Cuboid(Vector3.zero(), Vector3.zero(), Vector3.one(), vertices, triangulation.faces, triangulation.lines);
        result.setFaceColor(faceColor);
        result.setWireframeColor(lineColor);
        return result;
    }

    get normals()
    {
        return this.vertexNormals;
    }
}