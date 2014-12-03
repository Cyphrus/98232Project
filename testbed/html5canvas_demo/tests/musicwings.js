
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

    // speed diffs
    this.INITIAL_VELOCITY = new b2Vec2(3,2);
    this.TERMINAL_VELOCITY_X = 40; // maximum going right
    this.TERMINAL_VELOCITY_Y = -50; // maximum going down
    this.VELOCITY_Y = -2;

    // boost
    this.onGround = false;
    this.currentBoostFuel = 100.0; // a percentage
    this.MAX_BOOST_FUEL = 100.0;
    this.BOOST_DRAINAGE_RATE = 3.00;
    this.BOOST_REGENERATION_RATE = 0.1;
    this.BOOST_VELOCITY = new b2Vec2(0,1);

    // animation
    this.MAX_ANIMATION_PARTICLES = 10;
    this.MAX_INITIAL_PARTICLE_VELOCITY_X = 1;
    this.MAX_INITIAL_PARTICLE_VELOCITY_Y = 1;
    this.ANIMATION_CIRCLE = null;
    this.ANIMATION_SQUARE = null;

    // music
    this.visualizer = null;
}

embox2dTest_musicwings.prototype.setNiceViewCenter = function() {
    //called once when the user changes to this test from another test
    PTM = 32;
    setViewCenterWorld( new b2Vec2(0,1), true );
}

embox2dTest_musicwings.prototype.setup = function() {
    //set up the Box2D scene here - the world is already created

    var fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');

    var selectDialogueLink = document.createElement('a');
    selectDialogueLink.setAttribute('href', '');
    selectDialogueLink.innerText = "Select File";

    selectDialogueLink.onclick = function () {
        fileSelector.click();
        return false;
    }

    document.body.appendChild(selectDialogueLink);

    // music choice
    this.visualizer = new Visualizer();

    // create the player body
    var circleShape = new b2CircleShape();
    circleShape.set_m_radius(0.4);
    var fd = new b2FixtureDef();
    fd.set_shape(circleShape);
    fd.set_density(1.0);
    fd.set_friction(0.9);
    var bd = new b2BodyDef();
    bd.set_type(b2_dynamicBody);
    bd.set_position( new b2Vec2(3,10) );
    this.playerBody = world.CreateBody(bd);
    this.playerBody.CreateFixture(fd);
    this.playerBody.SetLinearVelocity(this.INITIAL_VELOCITY);

    // set collision detection for boosts
    /*
    var listener = new Box2D.JSContactListener();
    listener.BeginContact = function (contact) {
        this.currentBoostFuel += this.BOOST_REGENERATION_RATE;
        //this.playerBody.set_position(new b2Vec2(3,10));
        this.onGround = true;
        console.log("Contact detected");
        console.log(this.onGround);
    }
    listener.EndContact = function (contact) {
        this.onGround = false;
        console.log("Contact removed");
        console.log(this.onGround);
    }
    listener.PostSolve = function (contact, impulse) {
        // TODO Auto-generated method stub
    }
    listener.PreSolve = function (contact, oldManifold) {
        // TODO Auto-generated method stub
    }
    world.SetContactListener(listener);
    var tttt = world.GetContactList();
    console.log(tttt);
    */

    /*
    // animation parts
    // circle
    var animCircle = new b2CircleShape();
    animCircle.set_m_radius(0.4);
    var fdac = new b2FixtureDef();
    fdac.set_shape(animCircle);
    fdac.set_density(1.0);
    fdac.set_friction(0.9);
    var bdac = new b2BodyDef();
    bdac.set_type(b2_dynamicBody);
    bdac.set_position( new b2Vec2(3,10) );
    // square
    var animSquare = new b2();
    animCircle.set_m_radius(0.4);
    var fdac = new b2FixtureDef();
    fdac.set_shape(animCircle);
    fdac.set_density(1.0);
    fdac.set_friction(0.9);
    var bdac = new b2BodyDef();
    bdac.set_type(b2_dynamicBody);
    bdac.set_position( new b2Vec2(3,10) );
    */

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

    // animatePlayer();

    //move camera to follow player
    var pos = this.playerBody.GetPosition();
    var vel = this.playerBody.GetLinearVelocity();
    var futurePos = new b2Vec2( pos.get_x() + 0.15 * vel.get_x(), pos.get_y() + 0.15 * vel.get_y() );
    setViewCenterWorld( futurePos );

    // if player has travelled far enough, spawn a new edge
    if ( (pos.get_x() / this.EDGE_X) > this.edgeCount )
    {
        var array = this.virtualizer.getTerrainData();

        for (var i = 0; i < array.length; i++)
        {
            var nextY = array[i];
            this.edgeCount += 1;

            var v0 = this.lastEdgeVerts[0];
            var v1 = this.lastEdgeVerts[1];
            var v2 = this.lastEdgeVerts[2];

            var v3 = new b2Vec2(v2.get_x() + this.EDGE_X, newY);
            // randomization
            //var previousSlope = (v2.get_y()-v1.get_y()) / (v2.get_x()-v1.get_x());
            //var newSlope = previousSlope + ((0.2-Math.random()) * 3);
            //var v3 = new b2Vec2(v2.get_x() + this.EDGE_X, v2.get_y()+newSlope);

            var edge = new b2EdgeShape();
            edge.Set(v1, v2);
            edge.set_m_hasVertex0(true);
            edge.set_m_hasVertex3(true);
            edge.set_m_vertex0(v0);
            edge.set_m_vertex3(v3);

            this.tfd.set_shape(edge);
            this.edges.push(this.terrainBody.CreateFixture(this.tfd));

            this.lastEdgeVerts.shift();
            this.lastEdgeVerts.push(v3);
        }
        if(array.length > 0) {
            this.terrainBody.DestroyFixture(this.edges[0]);
            this.edges.shift();
        }
    }

    // adjust speeds so you won't break the floor
    // console.log(vel.get_x() + " | " + vel.get_y());
    var adjustedVel = new b2Vec2((vel.get_x() > this.TERMINAL_VELOCITY_X) ? this.TERMINAL_VELOCITY_X : vel.get_x(),
        (vel.get_y() < this.TERMINAL_VELOCITY_Y) ? this.TERMINAL_VELOCITY_Y : vel.get_y());
    this.playerBody.SetLinearVelocity(adjustedVel);

    // boost fuel increase
    this.currentBoostFuel += this.BOOST_REGENERATION_RATE;
    this.currentBoostFuel = (this.currentBoostFuel > this.MAX_BOOST_FUEL) ? this.MAX_BOOST_FUEL : this.currentBoostFuel;
    console.log(this.currentBoostFuel);
}

/*
embox2dTest_musicwings.prototype.animatePlayer = function() {
    for(var i = 0; i < Math.random()*this.MAX_ANIMATION_PARTICLES; i++) {
        // create particle

        this.particleBody.SetLinearVelocity(new b2Vec2(Math.random() * this.MAX_INITIAL_PARTICLE_VELOCITY_X,
            Math.random() * this.MAX_INITIAL_PARTICLE_VELOCITY_Y));
    }
}
*/

embox2dTest_musicwings.prototype.onKeyDown = function(canvas, evt) {
    evt.preventDefault();
    if ( evt.keyCode == 32 ) { // space
        var currVel = this.playerBody.GetLinearVelocity();
        var newVel = new b2Vec2(currVel.get_x(), currVel.get_y()+this.VELOCITY_Y);
        this.playerBody.SetLinearVelocity(newVel);
    } else if ( evt.keyCode == 87 ) { // 'w'
        if(this.currentBoostFuel > this.BOOST_DRAINAGE_RATE) {
            this.currentBoostFuel -= this.BOOST_DRAINAGE_RATE;
            var currVel = this.playerBody.GetLinearVelocity();
            this.playerBody.SetLinearVelocity(new b2Vec2(currVel.get_x() + this.BOOST_VELOCITY.get_x(),
                currVel.get_y() + this.BOOST_VELOCITY.get_y()));
        }
    }
}

embox2dTest_musicwings.prototype.onKeyUp = function(canvas, evt) {
    evt.preventDefault();
    if ( evt.keyCode == 87 ) { // 'w'
    }
}
