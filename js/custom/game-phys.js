// typedefs
var b2Vec2 = Box2D.Common.Math.b2Vec2
    ,   b2AABB = Box2D.Collision.b2AABB
    ,   b2BodyDef = Box2D.Dynamics.b2BodyDef
    ,   b2Body = Box2D.Dynamics.b2Body
    ,   b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    ,   b2Fixture = Box2D.Dynamics.b2Fixture
    ,   b2World = Box2D.Dynamics.b2World
    ,   b2MassData = Box2D.Collision.Shapes.b2MassData
    ,   b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    ,   b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    ,   b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    ,   b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
    ,   b2Transform = Box2D.Common.Math.b2Transform
    ;

// create world with gravity
var world = new b2World(new b2Vec2(0, 10), true);

var fixDef = new b2FixtureDef;
fixDef.density = 1.0;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;

var bodyDef = new b2BodyDef;

// create the 'player' circle body
bodyDef.type = b2Body.b2_staticBody;
bodyDef.linearVelocity = new b2Vec2(0,0);
fixDef.shape = new b2CircleShape;
fixDef.shape.SetRadius(0.1);
bodyDef.position.x = 0;
bodyDef.position.y = 0;
var body = world.CreateBody(bodyDef);
var playerFixture = body.CreateFixture(fixDef);


// debug draw
var debugDraw = new b2DebugDraw();
debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
debugDraw.SetDrawScale(30.0);
debugDraw.SetFillAlpha(0.5);
debugDraw.SetLineThickness(1.0);
debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
world.SetDebugDraw(debugDraw);

function update() {
    world.Step(1 / 60, 10, 10);
    world.DrawDebugData();
    world.ClearForces();
}
window.setInterval(update, 1000 / 60);