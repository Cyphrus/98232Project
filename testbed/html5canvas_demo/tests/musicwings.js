
var embox2dTest_musicwings = function() {
    //constructor
    this.edgeCount = 0;
    this.edges = []
    this.lastEdgeVerts = [];
    this.playerBody = null;
    this.terrainBody = null;
    this.tfd = null;

    this.EDGE_X = 3;
    this.NUM_EDGES = 10;
}

embox2dTest_musicwings.prototype.setNiceViewCenter = function() {
    //called once when the user changes to this test from another test
    PTM = 32;
    setViewCenterWorld( new b2Vec2(0,1), true );
}

embox2dTest_musicwings.prototype.setup = function() {
    //set up the Box2D scene here - the world is already created

    // create the player body
    var circleShape = new b2CircleShape();
    circleShape.set_m_radius(0.4);
    var fd = new b2FixtureDef();
    fd.set_shape(circleShape);
    fd.set_density(1.0);
    fd.set_friction(0.9);
    var bd = new b2BodyDef();
    bd.set_type(b2_dynamicBody);
    bd.set_position( new b2Vec2(4,10) );
    this.playerBody = world.CreateBody(bd);
    this.playerBody.CreateFixture(fd);

    var edgeVerts = [];
    edgeVerts.push(new b2Vec2(0, -1));
    edgeVerts.push(new b2Vec2(3, 5));
    edgeVerts.push(new b2Vec2(6, 0))
    for ( var i = 3; i < 13; i++ )
    {
        edgeVerts.push(new b2Vec2( this.EDGE_X * i, -i * this.EDGE_X / 2));
    }

    var ebd = new b2BodyDef();
    ebd.set_type(b2_staticBody);
    ebd.set_position( new b2Vec2(0, 0));
    this.terrainBody = world.CreateBody(ebd);

    var edgeShape = new b2EdgeShape();
    this.tfd = new b2FixtureDef();
    this.tfd.set_shape(edgeShape);
    this.tfd.set_density(0.0);
    this.tfd.set_friction(0.6);
    for ( var i = 0; i < 10; i++ )
    {
        edgeShape.Set(edgeVerts[i+1], edgeVerts[i+2]);
        edgeShape.set_m_hasVertex0(true);
        edgeShape.set_m_hasVertex3(true);
        edgeShape.set_m_vertex0(edgeVerts[i]);
        edgeShape.set_m_vertex3(edgeVerts[i+3]);

        this.edges.push(this.terrainBody.CreateFixture(this.tfd));
    }

    this.lastEdgeVerts.push(edgeVerts[10]);
    this.lastEdgeVerts.push(edgeVerts[11]);
    this.lastEdgeVerts.push(edgeVerts[12]);

    this.edgeCount = 9;
}

embox2dTest_musicwings.prototype.step = function() {
    //this function will be called at the beginning of every time step

    //move camera to follow player
    var pos = this.playerBody.GetPosition();
    var vel = this.playerBody.GetLinearVelocity();
    var futurePos = new b2Vec2( pos.get_x() + 0.15 * vel.get_x(), pos.get_y() + 0.15 * vel.get_y() );
    setViewCenterWorld( futurePos );

    // if player has travelled far enough, spawn a new edge
    if ( (pos.get_x() / this.EDGE_X) > this.edgeCount )
    {
        this.edgeCount += 1;

        var v0 = this.lastEdgeVerts[0]
        var v1 = this.lastEdgeVerts[1]
        var v2 = this.lastEdgeVerts[2]
    
        var v3 = new b2Vec2(v2.get_x() + this.EDGE_X, -(12 + this.edgeCount) );
    
        var edge = new b2EdgeShape();
        edge.Set(v1, v2);
        edge.set_m_hasVertex0(true);
        edge.set_m_hasVertex3(true);
        edge.set_m_vertex0(v0);
        edge.set_m_vertex3(v3);
    
        this.tfd.set_shape(edge);
        this.edges.push(this.terrainBody.CreateFixture(this.tfd));
    
        this.terrainBody.DestroyFixture(this.edges[0]);
        this.edges.shift();
        this.lastEdgeVerts.shift();
        this.lastEdgeVerts.push(v3);
    }
}

embox2dTest_musicwings.prototype.onKeyDown = function(canvas, evt) {
    if ( evt.keyCode == 65 ) { // 'a'
        //do something when the 'a' key is pressed
    }
}

embox2dTest_musicwings.prototype.onKeyUp = function(canvas, evt) {
    if ( evt.keyCode == 65 ) { // 'a'
        //do something when the 'a' key is released
    }
}
