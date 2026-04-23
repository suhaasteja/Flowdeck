/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const robot = $root.robot = (() => {

    /**
     * Namespace robot.
     * @exports robot
     * @namespace
     */
    const robot = {};

    robot.JointState = (function() {

        /**
         * Properties of a JointState.
         * @memberof robot
         * @interface IJointState
         * @property {Array.<number>|null} [positions] JointState positions
         * @property {Array.<number>|null} [velocities] JointState velocities
         * @property {Array.<number>|null} [efforts] JointState efforts
         * @property {boolean|null} [gripperClosed] JointState gripperClosed
         */

        /**
         * Constructs a new JointState.
         * @memberof robot
         * @classdesc Represents a JointState.
         * @implements IJointState
         * @constructor
         * @param {robot.IJointState=} [properties] Properties to set
         */
        function JointState(properties) {
            this.positions = [];
            this.velocities = [];
            this.efforts = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * JointState positions.
         * @member {Array.<number>} positions
         * @memberof robot.JointState
         * @instance
         */
        JointState.prototype.positions = $util.emptyArray;

        /**
         * JointState velocities.
         * @member {Array.<number>} velocities
         * @memberof robot.JointState
         * @instance
         */
        JointState.prototype.velocities = $util.emptyArray;

        /**
         * JointState efforts.
         * @member {Array.<number>} efforts
         * @memberof robot.JointState
         * @instance
         */
        JointState.prototype.efforts = $util.emptyArray;

        /**
         * JointState gripperClosed.
         * @member {boolean} gripperClosed
         * @memberof robot.JointState
         * @instance
         */
        JointState.prototype.gripperClosed = false;

        /**
         * Creates a new JointState instance using the specified properties.
         * @function create
         * @memberof robot.JointState
         * @static
         * @param {robot.IJointState=} [properties] Properties to set
         * @returns {robot.JointState} JointState instance
         */
        JointState.create = function create(properties) {
            return new JointState(properties);
        };

        /**
         * Encodes the specified JointState message. Does not implicitly {@link robot.JointState.verify|verify} messages.
         * @function encode
         * @memberof robot.JointState
         * @static
         * @param {robot.IJointState} message JointState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JointState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.positions != null && message.positions.length) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork();
                for (let i = 0; i < message.positions.length; ++i)
                    writer.double(message.positions[i]);
                writer.ldelim();
            }
            if (message.velocities != null && message.velocities.length) {
                writer.uint32(/* id 2, wireType 2 =*/18).fork();
                for (let i = 0; i < message.velocities.length; ++i)
                    writer.double(message.velocities[i]);
                writer.ldelim();
            }
            if (message.efforts != null && message.efforts.length) {
                writer.uint32(/* id 3, wireType 2 =*/26).fork();
                for (let i = 0; i < message.efforts.length; ++i)
                    writer.double(message.efforts[i]);
                writer.ldelim();
            }
            if (message.gripperClosed != null && Object.hasOwnProperty.call(message, "gripperClosed"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.gripperClosed);
            return writer;
        };

        /**
         * Encodes the specified JointState message, length delimited. Does not implicitly {@link robot.JointState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof robot.JointState
         * @static
         * @param {robot.IJointState} message JointState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JointState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a JointState message from the specified reader or buffer.
         * @function decode
         * @memberof robot.JointState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {robot.JointState} JointState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JointState.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.robot.JointState();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.positions && message.positions.length))
                            message.positions = [];
                        if ((tag & 7) === 2) {
                            let end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.positions.push(reader.double());
                        } else
                            message.positions.push(reader.double());
                        break;
                    }
                case 2: {
                        if (!(message.velocities && message.velocities.length))
                            message.velocities = [];
                        if ((tag & 7) === 2) {
                            let end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.velocities.push(reader.double());
                        } else
                            message.velocities.push(reader.double());
                        break;
                    }
                case 3: {
                        if (!(message.efforts && message.efforts.length))
                            message.efforts = [];
                        if ((tag & 7) === 2) {
                            let end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.efforts.push(reader.double());
                        } else
                            message.efforts.push(reader.double());
                        break;
                    }
                case 4: {
                        message.gripperClosed = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a JointState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof robot.JointState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {robot.JointState} JointState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JointState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a JointState message.
         * @function verify
         * @memberof robot.JointState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        JointState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.positions != null && message.hasOwnProperty("positions")) {
                if (!Array.isArray(message.positions))
                    return "positions: array expected";
                for (let i = 0; i < message.positions.length; ++i)
                    if (typeof message.positions[i] !== "number")
                        return "positions: number[] expected";
            }
            if (message.velocities != null && message.hasOwnProperty("velocities")) {
                if (!Array.isArray(message.velocities))
                    return "velocities: array expected";
                for (let i = 0; i < message.velocities.length; ++i)
                    if (typeof message.velocities[i] !== "number")
                        return "velocities: number[] expected";
            }
            if (message.efforts != null && message.hasOwnProperty("efforts")) {
                if (!Array.isArray(message.efforts))
                    return "efforts: array expected";
                for (let i = 0; i < message.efforts.length; ++i)
                    if (typeof message.efforts[i] !== "number")
                        return "efforts: number[] expected";
            }
            if (message.gripperClosed != null && message.hasOwnProperty("gripperClosed"))
                if (typeof message.gripperClosed !== "boolean")
                    return "gripperClosed: boolean expected";
            return null;
        };

        /**
         * Creates a JointState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof robot.JointState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {robot.JointState} JointState
         */
        JointState.fromObject = function fromObject(object) {
            if (object instanceof $root.robot.JointState)
                return object;
            let message = new $root.robot.JointState();
            if (object.positions) {
                if (!Array.isArray(object.positions))
                    throw TypeError(".robot.JointState.positions: array expected");
                message.positions = [];
                for (let i = 0; i < object.positions.length; ++i)
                    message.positions[i] = Number(object.positions[i]);
            }
            if (object.velocities) {
                if (!Array.isArray(object.velocities))
                    throw TypeError(".robot.JointState.velocities: array expected");
                message.velocities = [];
                for (let i = 0; i < object.velocities.length; ++i)
                    message.velocities[i] = Number(object.velocities[i]);
            }
            if (object.efforts) {
                if (!Array.isArray(object.efforts))
                    throw TypeError(".robot.JointState.efforts: array expected");
                message.efforts = [];
                for (let i = 0; i < object.efforts.length; ++i)
                    message.efforts[i] = Number(object.efforts[i]);
            }
            if (object.gripperClosed != null)
                message.gripperClosed = Boolean(object.gripperClosed);
            return message;
        };

        /**
         * Creates a plain object from a JointState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof robot.JointState
         * @static
         * @param {robot.JointState} message JointState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        JointState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults) {
                object.positions = [];
                object.velocities = [];
                object.efforts = [];
            }
            if (options.defaults)
                object.gripperClosed = false;
            if (message.positions && message.positions.length) {
                object.positions = [];
                for (let j = 0; j < message.positions.length; ++j)
                    object.positions[j] = options.json && !isFinite(message.positions[j]) ? String(message.positions[j]) : message.positions[j];
            }
            if (message.velocities && message.velocities.length) {
                object.velocities = [];
                for (let j = 0; j < message.velocities.length; ++j)
                    object.velocities[j] = options.json && !isFinite(message.velocities[j]) ? String(message.velocities[j]) : message.velocities[j];
            }
            if (message.efforts && message.efforts.length) {
                object.efforts = [];
                for (let j = 0; j < message.efforts.length; ++j)
                    object.efforts[j] = options.json && !isFinite(message.efforts[j]) ? String(message.efforts[j]) : message.efforts[j];
            }
            if (message.gripperClosed != null && message.hasOwnProperty("gripperClosed"))
                object.gripperClosed = message.gripperClosed;
            return object;
        };

        /**
         * Converts this JointState to JSON.
         * @function toJSON
         * @memberof robot.JointState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        JointState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for JointState
         * @function getTypeUrl
         * @memberof robot.JointState
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        JointState.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/robot.JointState";
        };

        return JointState;
    })();

    robot.TcpPose = (function() {

        /**
         * Properties of a TcpPose.
         * @memberof robot
         * @interface ITcpPose
         * @property {number|null} [x] TcpPose x
         * @property {number|null} [y] TcpPose y
         * @property {number|null} [z] TcpPose z
         * @property {number|null} [rx] TcpPose rx
         * @property {number|null} [ry] TcpPose ry
         * @property {number|null} [rz] TcpPose rz
         */

        /**
         * Constructs a new TcpPose.
         * @memberof robot
         * @classdesc Represents a TcpPose.
         * @implements ITcpPose
         * @constructor
         * @param {robot.ITcpPose=} [properties] Properties to set
         */
        function TcpPose(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TcpPose x.
         * @member {number} x
         * @memberof robot.TcpPose
         * @instance
         */
        TcpPose.prototype.x = 0;

        /**
         * TcpPose y.
         * @member {number} y
         * @memberof robot.TcpPose
         * @instance
         */
        TcpPose.prototype.y = 0;

        /**
         * TcpPose z.
         * @member {number} z
         * @memberof robot.TcpPose
         * @instance
         */
        TcpPose.prototype.z = 0;

        /**
         * TcpPose rx.
         * @member {number} rx
         * @memberof robot.TcpPose
         * @instance
         */
        TcpPose.prototype.rx = 0;

        /**
         * TcpPose ry.
         * @member {number} ry
         * @memberof robot.TcpPose
         * @instance
         */
        TcpPose.prototype.ry = 0;

        /**
         * TcpPose rz.
         * @member {number} rz
         * @memberof robot.TcpPose
         * @instance
         */
        TcpPose.prototype.rz = 0;

        /**
         * Creates a new TcpPose instance using the specified properties.
         * @function create
         * @memberof robot.TcpPose
         * @static
         * @param {robot.ITcpPose=} [properties] Properties to set
         * @returns {robot.TcpPose} TcpPose instance
         */
        TcpPose.create = function create(properties) {
            return new TcpPose(properties);
        };

        /**
         * Encodes the specified TcpPose message. Does not implicitly {@link robot.TcpPose.verify|verify} messages.
         * @function encode
         * @memberof robot.TcpPose
         * @static
         * @param {robot.ITcpPose} message TcpPose message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TcpPose.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.x);
            if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.y);
            if (message.z != null && Object.hasOwnProperty.call(message, "z"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.z);
            if (message.rx != null && Object.hasOwnProperty.call(message, "rx"))
                writer.uint32(/* id 4, wireType 1 =*/33).double(message.rx);
            if (message.ry != null && Object.hasOwnProperty.call(message, "ry"))
                writer.uint32(/* id 5, wireType 1 =*/41).double(message.ry);
            if (message.rz != null && Object.hasOwnProperty.call(message, "rz"))
                writer.uint32(/* id 6, wireType 1 =*/49).double(message.rz);
            return writer;
        };

        /**
         * Encodes the specified TcpPose message, length delimited. Does not implicitly {@link robot.TcpPose.verify|verify} messages.
         * @function encodeDelimited
         * @memberof robot.TcpPose
         * @static
         * @param {robot.ITcpPose} message TcpPose message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TcpPose.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TcpPose message from the specified reader or buffer.
         * @function decode
         * @memberof robot.TcpPose
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {robot.TcpPose} TcpPose
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TcpPose.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.robot.TcpPose();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.x = reader.double();
                        break;
                    }
                case 2: {
                        message.y = reader.double();
                        break;
                    }
                case 3: {
                        message.z = reader.double();
                        break;
                    }
                case 4: {
                        message.rx = reader.double();
                        break;
                    }
                case 5: {
                        message.ry = reader.double();
                        break;
                    }
                case 6: {
                        message.rz = reader.double();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TcpPose message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof robot.TcpPose
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {robot.TcpPose} TcpPose
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TcpPose.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TcpPose message.
         * @function verify
         * @memberof robot.TcpPose
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TcpPose.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.x != null && message.hasOwnProperty("x"))
                if (typeof message.x !== "number")
                    return "x: number expected";
            if (message.y != null && message.hasOwnProperty("y"))
                if (typeof message.y !== "number")
                    return "y: number expected";
            if (message.z != null && message.hasOwnProperty("z"))
                if (typeof message.z !== "number")
                    return "z: number expected";
            if (message.rx != null && message.hasOwnProperty("rx"))
                if (typeof message.rx !== "number")
                    return "rx: number expected";
            if (message.ry != null && message.hasOwnProperty("ry"))
                if (typeof message.ry !== "number")
                    return "ry: number expected";
            if (message.rz != null && message.hasOwnProperty("rz"))
                if (typeof message.rz !== "number")
                    return "rz: number expected";
            return null;
        };

        /**
         * Creates a TcpPose message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof robot.TcpPose
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {robot.TcpPose} TcpPose
         */
        TcpPose.fromObject = function fromObject(object) {
            if (object instanceof $root.robot.TcpPose)
                return object;
            let message = new $root.robot.TcpPose();
            if (object.x != null)
                message.x = Number(object.x);
            if (object.y != null)
                message.y = Number(object.y);
            if (object.z != null)
                message.z = Number(object.z);
            if (object.rx != null)
                message.rx = Number(object.rx);
            if (object.ry != null)
                message.ry = Number(object.ry);
            if (object.rz != null)
                message.rz = Number(object.rz);
            return message;
        };

        /**
         * Creates a plain object from a TcpPose message. Also converts values to other types if specified.
         * @function toObject
         * @memberof robot.TcpPose
         * @static
         * @param {robot.TcpPose} message TcpPose
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TcpPose.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.x = 0;
                object.y = 0;
                object.z = 0;
                object.rx = 0;
                object.ry = 0;
                object.rz = 0;
            }
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
            if (message.z != null && message.hasOwnProperty("z"))
                object.z = options.json && !isFinite(message.z) ? String(message.z) : message.z;
            if (message.rx != null && message.hasOwnProperty("rx"))
                object.rx = options.json && !isFinite(message.rx) ? String(message.rx) : message.rx;
            if (message.ry != null && message.hasOwnProperty("ry"))
                object.ry = options.json && !isFinite(message.ry) ? String(message.ry) : message.ry;
            if (message.rz != null && message.hasOwnProperty("rz"))
                object.rz = options.json && !isFinite(message.rz) ? String(message.rz) : message.rz;
            return object;
        };

        /**
         * Converts this TcpPose to JSON.
         * @function toJSON
         * @memberof robot.TcpPose
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TcpPose.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TcpPose
         * @function getTypeUrl
         * @memberof robot.TcpPose
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TcpPose.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/robot.TcpPose";
        };

        return TcpPose;
    })();

    robot.RobotState = (function() {

        /**
         * Properties of a RobotState.
         * @memberof robot
         * @interface IRobotState
         * @property {robot.IJointState|null} [joints] RobotState joints
         * @property {robot.ITcpPose|null} [tcp] RobotState tcp
         * @property {string|null} [status] RobotState status
         * @property {number|null} [cycleCount] RobotState cycleCount
         * @property {string|null} [currentSkill] RobotState currentSkill
         */

        /**
         * Constructs a new RobotState.
         * @memberof robot
         * @classdesc Represents a RobotState.
         * @implements IRobotState
         * @constructor
         * @param {robot.IRobotState=} [properties] Properties to set
         */
        function RobotState(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RobotState joints.
         * @member {robot.IJointState|null|undefined} joints
         * @memberof robot.RobotState
         * @instance
         */
        RobotState.prototype.joints = null;

        /**
         * RobotState tcp.
         * @member {robot.ITcpPose|null|undefined} tcp
         * @memberof robot.RobotState
         * @instance
         */
        RobotState.prototype.tcp = null;

        /**
         * RobotState status.
         * @member {string} status
         * @memberof robot.RobotState
         * @instance
         */
        RobotState.prototype.status = "";

        /**
         * RobotState cycleCount.
         * @member {number} cycleCount
         * @memberof robot.RobotState
         * @instance
         */
        RobotState.prototype.cycleCount = 0;

        /**
         * RobotState currentSkill.
         * @member {string} currentSkill
         * @memberof robot.RobotState
         * @instance
         */
        RobotState.prototype.currentSkill = "";

        /**
         * Creates a new RobotState instance using the specified properties.
         * @function create
         * @memberof robot.RobotState
         * @static
         * @param {robot.IRobotState=} [properties] Properties to set
         * @returns {robot.RobotState} RobotState instance
         */
        RobotState.create = function create(properties) {
            return new RobotState(properties);
        };

        /**
         * Encodes the specified RobotState message. Does not implicitly {@link robot.RobotState.verify|verify} messages.
         * @function encode
         * @memberof robot.RobotState
         * @static
         * @param {robot.IRobotState} message RobotState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RobotState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.joints != null && Object.hasOwnProperty.call(message, "joints"))
                $root.robot.JointState.encode(message.joints, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.tcp != null && Object.hasOwnProperty.call(message, "tcp"))
                $root.robot.TcpPose.encode(message.tcp, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.status);
            if (message.cycleCount != null && Object.hasOwnProperty.call(message, "cycleCount"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.cycleCount);
            if (message.currentSkill != null && Object.hasOwnProperty.call(message, "currentSkill"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.currentSkill);
            return writer;
        };

        /**
         * Encodes the specified RobotState message, length delimited. Does not implicitly {@link robot.RobotState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof robot.RobotState
         * @static
         * @param {robot.IRobotState} message RobotState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RobotState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RobotState message from the specified reader or buffer.
         * @function decode
         * @memberof robot.RobotState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {robot.RobotState} RobotState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RobotState.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.robot.RobotState();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.joints = $root.robot.JointState.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.tcp = $root.robot.TcpPose.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.status = reader.string();
                        break;
                    }
                case 4: {
                        message.cycleCount = reader.int32();
                        break;
                    }
                case 5: {
                        message.currentSkill = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RobotState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof robot.RobotState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {robot.RobotState} RobotState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RobotState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RobotState message.
         * @function verify
         * @memberof robot.RobotState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RobotState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.joints != null && message.hasOwnProperty("joints")) {
                let error = $root.robot.JointState.verify(message.joints);
                if (error)
                    return "joints." + error;
            }
            if (message.tcp != null && message.hasOwnProperty("tcp")) {
                let error = $root.robot.TcpPose.verify(message.tcp);
                if (error)
                    return "tcp." + error;
            }
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isString(message.status))
                    return "status: string expected";
            if (message.cycleCount != null && message.hasOwnProperty("cycleCount"))
                if (!$util.isInteger(message.cycleCount))
                    return "cycleCount: integer expected";
            if (message.currentSkill != null && message.hasOwnProperty("currentSkill"))
                if (!$util.isString(message.currentSkill))
                    return "currentSkill: string expected";
            return null;
        };

        /**
         * Creates a RobotState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof robot.RobotState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {robot.RobotState} RobotState
         */
        RobotState.fromObject = function fromObject(object) {
            if (object instanceof $root.robot.RobotState)
                return object;
            let message = new $root.robot.RobotState();
            if (object.joints != null) {
                if (typeof object.joints !== "object")
                    throw TypeError(".robot.RobotState.joints: object expected");
                message.joints = $root.robot.JointState.fromObject(object.joints);
            }
            if (object.tcp != null) {
                if (typeof object.tcp !== "object")
                    throw TypeError(".robot.RobotState.tcp: object expected");
                message.tcp = $root.robot.TcpPose.fromObject(object.tcp);
            }
            if (object.status != null)
                message.status = String(object.status);
            if (object.cycleCount != null)
                message.cycleCount = object.cycleCount | 0;
            if (object.currentSkill != null)
                message.currentSkill = String(object.currentSkill);
            return message;
        };

        /**
         * Creates a plain object from a RobotState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof robot.RobotState
         * @static
         * @param {robot.RobotState} message RobotState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RobotState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.joints = null;
                object.tcp = null;
                object.status = "";
                object.cycleCount = 0;
                object.currentSkill = "";
            }
            if (message.joints != null && message.hasOwnProperty("joints"))
                object.joints = $root.robot.JointState.toObject(message.joints, options);
            if (message.tcp != null && message.hasOwnProperty("tcp"))
                object.tcp = $root.robot.TcpPose.toObject(message.tcp, options);
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            if (message.cycleCount != null && message.hasOwnProperty("cycleCount"))
                object.cycleCount = message.cycleCount;
            if (message.currentSkill != null && message.hasOwnProperty("currentSkill"))
                object.currentSkill = message.currentSkill;
            return object;
        };

        /**
         * Converts this RobotState to JSON.
         * @function toJSON
         * @memberof robot.RobotState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RobotState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for RobotState
         * @function getTypeUrl
         * @memberof robot.RobotState
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        RobotState.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/robot.RobotState";
        };

        return RobotState;
    })();

    robot.Fault = (function() {

        /**
         * Properties of a Fault.
         * @memberof robot
         * @interface IFault
         * @property {string|null} [id] Fault id
         * @property {string|null} [code] Fault code
         * @property {string|null} [message] Fault message
         * @property {number|null} [jointIndex] Fault jointIndex
         * @property {number|null} [timestamp] Fault timestamp
         */

        /**
         * Constructs a new Fault.
         * @memberof robot
         * @classdesc Represents a Fault.
         * @implements IFault
         * @constructor
         * @param {robot.IFault=} [properties] Properties to set
         */
        function Fault(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Fault id.
         * @member {string} id
         * @memberof robot.Fault
         * @instance
         */
        Fault.prototype.id = "";

        /**
         * Fault code.
         * @member {string} code
         * @memberof robot.Fault
         * @instance
         */
        Fault.prototype.code = "";

        /**
         * Fault message.
         * @member {string} message
         * @memberof robot.Fault
         * @instance
         */
        Fault.prototype.message = "";

        /**
         * Fault jointIndex.
         * @member {number} jointIndex
         * @memberof robot.Fault
         * @instance
         */
        Fault.prototype.jointIndex = 0;

        /**
         * Fault timestamp.
         * @member {number} timestamp
         * @memberof robot.Fault
         * @instance
         */
        Fault.prototype.timestamp = 0;

        /**
         * Creates a new Fault instance using the specified properties.
         * @function create
         * @memberof robot.Fault
         * @static
         * @param {robot.IFault=} [properties] Properties to set
         * @returns {robot.Fault} Fault instance
         */
        Fault.create = function create(properties) {
            return new Fault(properties);
        };

        /**
         * Encodes the specified Fault message. Does not implicitly {@link robot.Fault.verify|verify} messages.
         * @function encode
         * @memberof robot.Fault
         * @static
         * @param {robot.IFault} message Fault message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Fault.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.code);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.message);
            if (message.jointIndex != null && Object.hasOwnProperty.call(message, "jointIndex"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.jointIndex);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 5, wireType 1 =*/41).double(message.timestamp);
            return writer;
        };

        /**
         * Encodes the specified Fault message, length delimited. Does not implicitly {@link robot.Fault.verify|verify} messages.
         * @function encodeDelimited
         * @memberof robot.Fault
         * @static
         * @param {robot.IFault} message Fault message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Fault.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Fault message from the specified reader or buffer.
         * @function decode
         * @memberof robot.Fault
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {robot.Fault} Fault
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Fault.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.robot.Fault();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.code = reader.string();
                        break;
                    }
                case 3: {
                        message.message = reader.string();
                        break;
                    }
                case 4: {
                        message.jointIndex = reader.int32();
                        break;
                    }
                case 5: {
                        message.timestamp = reader.double();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Fault message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof robot.Fault
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {robot.Fault} Fault
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Fault.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Fault message.
         * @function verify
         * @memberof robot.Fault
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Fault.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isString(message.code))
                    return "code: string expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            if (message.jointIndex != null && message.hasOwnProperty("jointIndex"))
                if (!$util.isInteger(message.jointIndex))
                    return "jointIndex: integer expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp !== "number")
                    return "timestamp: number expected";
            return null;
        };

        /**
         * Creates a Fault message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof robot.Fault
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {robot.Fault} Fault
         */
        Fault.fromObject = function fromObject(object) {
            if (object instanceof $root.robot.Fault)
                return object;
            let message = new $root.robot.Fault();
            if (object.id != null)
                message.id = String(object.id);
            if (object.code != null)
                message.code = String(object.code);
            if (object.message != null)
                message.message = String(object.message);
            if (object.jointIndex != null)
                message.jointIndex = object.jointIndex | 0;
            if (object.timestamp != null)
                message.timestamp = Number(object.timestamp);
            return message;
        };

        /**
         * Creates a plain object from a Fault message. Also converts values to other types if specified.
         * @function toObject
         * @memberof robot.Fault
         * @static
         * @param {robot.Fault} message Fault
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Fault.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = "";
                object.code = "";
                object.message = "";
                object.jointIndex = 0;
                object.timestamp = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            if (message.jointIndex != null && message.hasOwnProperty("jointIndex"))
                object.jointIndex = message.jointIndex;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                object.timestamp = options.json && !isFinite(message.timestamp) ? String(message.timestamp) : message.timestamp;
            return object;
        };

        /**
         * Converts this Fault to JSON.
         * @function toJSON
         * @memberof robot.Fault
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Fault.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Fault
         * @function getTypeUrl
         * @memberof robot.Fault
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Fault.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/robot.Fault";
        };

        return Fault;
    })();

    robot.FaultCleared = (function() {

        /**
         * Properties of a FaultCleared.
         * @memberof robot
         * @interface IFaultCleared
         */

        /**
         * Constructs a new FaultCleared.
         * @memberof robot
         * @classdesc Represents a FaultCleared.
         * @implements IFaultCleared
         * @constructor
         * @param {robot.IFaultCleared=} [properties] Properties to set
         */
        function FaultCleared(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new FaultCleared instance using the specified properties.
         * @function create
         * @memberof robot.FaultCleared
         * @static
         * @param {robot.IFaultCleared=} [properties] Properties to set
         * @returns {robot.FaultCleared} FaultCleared instance
         */
        FaultCleared.create = function create(properties) {
            return new FaultCleared(properties);
        };

        /**
         * Encodes the specified FaultCleared message. Does not implicitly {@link robot.FaultCleared.verify|verify} messages.
         * @function encode
         * @memberof robot.FaultCleared
         * @static
         * @param {robot.IFaultCleared} message FaultCleared message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FaultCleared.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified FaultCleared message, length delimited. Does not implicitly {@link robot.FaultCleared.verify|verify} messages.
         * @function encodeDelimited
         * @memberof robot.FaultCleared
         * @static
         * @param {robot.IFaultCleared} message FaultCleared message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FaultCleared.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FaultCleared message from the specified reader or buffer.
         * @function decode
         * @memberof robot.FaultCleared
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {robot.FaultCleared} FaultCleared
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FaultCleared.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.robot.FaultCleared();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FaultCleared message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof robot.FaultCleared
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {robot.FaultCleared} FaultCleared
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FaultCleared.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FaultCleared message.
         * @function verify
         * @memberof robot.FaultCleared
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FaultCleared.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a FaultCleared message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof robot.FaultCleared
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {robot.FaultCleared} FaultCleared
         */
        FaultCleared.fromObject = function fromObject(object) {
            if (object instanceof $root.robot.FaultCleared)
                return object;
            return new $root.robot.FaultCleared();
        };

        /**
         * Creates a plain object from a FaultCleared message. Also converts values to other types if specified.
         * @function toObject
         * @memberof robot.FaultCleared
         * @static
         * @param {robot.FaultCleared} message FaultCleared
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FaultCleared.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this FaultCleared to JSON.
         * @function toJSON
         * @memberof robot.FaultCleared
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FaultCleared.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FaultCleared
         * @function getTypeUrl
         * @memberof robot.FaultCleared
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FaultCleared.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/robot.FaultCleared";
        };

        return FaultCleared;
    })();

    robot.ServerMessage = (function() {

        /**
         * Properties of a ServerMessage.
         * @memberof robot
         * @interface IServerMessage
         * @property {robot.IRobotState|null} [state] ServerMessage state
         * @property {robot.IFault|null} [fault] ServerMessage fault
         * @property {robot.IFaultCleared|null} [faultCleared] ServerMessage faultCleared
         */

        /**
         * Constructs a new ServerMessage.
         * @memberof robot
         * @classdesc Represents a ServerMessage.
         * @implements IServerMessage
         * @constructor
         * @param {robot.IServerMessage=} [properties] Properties to set
         */
        function ServerMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ServerMessage state.
         * @member {robot.IRobotState|null|undefined} state
         * @memberof robot.ServerMessage
         * @instance
         */
        ServerMessage.prototype.state = null;

        /**
         * ServerMessage fault.
         * @member {robot.IFault|null|undefined} fault
         * @memberof robot.ServerMessage
         * @instance
         */
        ServerMessage.prototype.fault = null;

        /**
         * ServerMessage faultCleared.
         * @member {robot.IFaultCleared|null|undefined} faultCleared
         * @memberof robot.ServerMessage
         * @instance
         */
        ServerMessage.prototype.faultCleared = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * ServerMessage payload.
         * @member {"state"|"fault"|"faultCleared"|undefined} payload
         * @memberof robot.ServerMessage
         * @instance
         */
        Object.defineProperty(ServerMessage.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["state", "fault", "faultCleared"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new ServerMessage instance using the specified properties.
         * @function create
         * @memberof robot.ServerMessage
         * @static
         * @param {robot.IServerMessage=} [properties] Properties to set
         * @returns {robot.ServerMessage} ServerMessage instance
         */
        ServerMessage.create = function create(properties) {
            return new ServerMessage(properties);
        };

        /**
         * Encodes the specified ServerMessage message. Does not implicitly {@link robot.ServerMessage.verify|verify} messages.
         * @function encode
         * @memberof robot.ServerMessage
         * @static
         * @param {robot.IServerMessage} message ServerMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.state != null && Object.hasOwnProperty.call(message, "state"))
                $root.robot.RobotState.encode(message.state, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.fault != null && Object.hasOwnProperty.call(message, "fault"))
                $root.robot.Fault.encode(message.fault, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.faultCleared != null && Object.hasOwnProperty.call(message, "faultCleared"))
                $root.robot.FaultCleared.encode(message.faultCleared, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ServerMessage message, length delimited. Does not implicitly {@link robot.ServerMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof robot.ServerMessage
         * @static
         * @param {robot.IServerMessage} message ServerMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ServerMessage message from the specified reader or buffer.
         * @function decode
         * @memberof robot.ServerMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {robot.ServerMessage} ServerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.robot.ServerMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.state = $root.robot.RobotState.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.fault = $root.robot.Fault.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.faultCleared = $root.robot.FaultCleared.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ServerMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof robot.ServerMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {robot.ServerMessage} ServerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ServerMessage message.
         * @function verify
         * @memberof robot.ServerMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ServerMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.state != null && message.hasOwnProperty("state")) {
                properties.payload = 1;
                {
                    let error = $root.robot.RobotState.verify(message.state);
                    if (error)
                        return "state." + error;
                }
            }
            if (message.fault != null && message.hasOwnProperty("fault")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.robot.Fault.verify(message.fault);
                    if (error)
                        return "fault." + error;
                }
            }
            if (message.faultCleared != null && message.hasOwnProperty("faultCleared")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.robot.FaultCleared.verify(message.faultCleared);
                    if (error)
                        return "faultCleared." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ServerMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof robot.ServerMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {robot.ServerMessage} ServerMessage
         */
        ServerMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.robot.ServerMessage)
                return object;
            let message = new $root.robot.ServerMessage();
            if (object.state != null) {
                if (typeof object.state !== "object")
                    throw TypeError(".robot.ServerMessage.state: object expected");
                message.state = $root.robot.RobotState.fromObject(object.state);
            }
            if (object.fault != null) {
                if (typeof object.fault !== "object")
                    throw TypeError(".robot.ServerMessage.fault: object expected");
                message.fault = $root.robot.Fault.fromObject(object.fault);
            }
            if (object.faultCleared != null) {
                if (typeof object.faultCleared !== "object")
                    throw TypeError(".robot.ServerMessage.faultCleared: object expected");
                message.faultCleared = $root.robot.FaultCleared.fromObject(object.faultCleared);
            }
            return message;
        };

        /**
         * Creates a plain object from a ServerMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof robot.ServerMessage
         * @static
         * @param {robot.ServerMessage} message ServerMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ServerMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.state != null && message.hasOwnProperty("state")) {
                object.state = $root.robot.RobotState.toObject(message.state, options);
                if (options.oneofs)
                    object.payload = "state";
            }
            if (message.fault != null && message.hasOwnProperty("fault")) {
                object.fault = $root.robot.Fault.toObject(message.fault, options);
                if (options.oneofs)
                    object.payload = "fault";
            }
            if (message.faultCleared != null && message.hasOwnProperty("faultCleared")) {
                object.faultCleared = $root.robot.FaultCleared.toObject(message.faultCleared, options);
                if (options.oneofs)
                    object.payload = "faultCleared";
            }
            return object;
        };

        /**
         * Converts this ServerMessage to JSON.
         * @function toJSON
         * @memberof robot.ServerMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ServerMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ServerMessage
         * @function getTypeUrl
         * @memberof robot.ServerMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ServerMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/robot.ServerMessage";
        };

        return ServerMessage;
    })();

    robot.SkillCommand = (function() {

        /**
         * Properties of a SkillCommand.
         * @memberof robot
         * @interface ISkillCommand
         * @property {string|null} [skillId] SkillCommand skillId
         */

        /**
         * Constructs a new SkillCommand.
         * @memberof robot
         * @classdesc Represents a SkillCommand.
         * @implements ISkillCommand
         * @constructor
         * @param {robot.ISkillCommand=} [properties] Properties to set
         */
        function SkillCommand(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SkillCommand skillId.
         * @member {string} skillId
         * @memberof robot.SkillCommand
         * @instance
         */
        SkillCommand.prototype.skillId = "";

        /**
         * Creates a new SkillCommand instance using the specified properties.
         * @function create
         * @memberof robot.SkillCommand
         * @static
         * @param {robot.ISkillCommand=} [properties] Properties to set
         * @returns {robot.SkillCommand} SkillCommand instance
         */
        SkillCommand.create = function create(properties) {
            return new SkillCommand(properties);
        };

        /**
         * Encodes the specified SkillCommand message. Does not implicitly {@link robot.SkillCommand.verify|verify} messages.
         * @function encode
         * @memberof robot.SkillCommand
         * @static
         * @param {robot.ISkillCommand} message SkillCommand message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SkillCommand.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.skillId != null && Object.hasOwnProperty.call(message, "skillId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.skillId);
            return writer;
        };

        /**
         * Encodes the specified SkillCommand message, length delimited. Does not implicitly {@link robot.SkillCommand.verify|verify} messages.
         * @function encodeDelimited
         * @memberof robot.SkillCommand
         * @static
         * @param {robot.ISkillCommand} message SkillCommand message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SkillCommand.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SkillCommand message from the specified reader or buffer.
         * @function decode
         * @memberof robot.SkillCommand
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {robot.SkillCommand} SkillCommand
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SkillCommand.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.robot.SkillCommand();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.skillId = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SkillCommand message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof robot.SkillCommand
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {robot.SkillCommand} SkillCommand
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SkillCommand.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SkillCommand message.
         * @function verify
         * @memberof robot.SkillCommand
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SkillCommand.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.skillId != null && message.hasOwnProperty("skillId"))
                if (!$util.isString(message.skillId))
                    return "skillId: string expected";
            return null;
        };

        /**
         * Creates a SkillCommand message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof robot.SkillCommand
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {robot.SkillCommand} SkillCommand
         */
        SkillCommand.fromObject = function fromObject(object) {
            if (object instanceof $root.robot.SkillCommand)
                return object;
            let message = new $root.robot.SkillCommand();
            if (object.skillId != null)
                message.skillId = String(object.skillId);
            return message;
        };

        /**
         * Creates a plain object from a SkillCommand message. Also converts values to other types if specified.
         * @function toObject
         * @memberof robot.SkillCommand
         * @static
         * @param {robot.SkillCommand} message SkillCommand
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SkillCommand.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.skillId = "";
            if (message.skillId != null && message.hasOwnProperty("skillId"))
                object.skillId = message.skillId;
            return object;
        };

        /**
         * Converts this SkillCommand to JSON.
         * @function toJSON
         * @memberof robot.SkillCommand
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SkillCommand.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SkillCommand
         * @function getTypeUrl
         * @memberof robot.SkillCommand
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SkillCommand.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/robot.SkillCommand";
        };

        return SkillCommand;
    })();

    robot.EStop = (function() {

        /**
         * Properties of a EStop.
         * @memberof robot
         * @interface IEStop
         */

        /**
         * Constructs a new EStop.
         * @memberof robot
         * @classdesc Represents a EStop.
         * @implements IEStop
         * @constructor
         * @param {robot.IEStop=} [properties] Properties to set
         */
        function EStop(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new EStop instance using the specified properties.
         * @function create
         * @memberof robot.EStop
         * @static
         * @param {robot.IEStop=} [properties] Properties to set
         * @returns {robot.EStop} EStop instance
         */
        EStop.create = function create(properties) {
            return new EStop(properties);
        };

        /**
         * Encodes the specified EStop message. Does not implicitly {@link robot.EStop.verify|verify} messages.
         * @function encode
         * @memberof robot.EStop
         * @static
         * @param {robot.IEStop} message EStop message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EStop.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified EStop message, length delimited. Does not implicitly {@link robot.EStop.verify|verify} messages.
         * @function encodeDelimited
         * @memberof robot.EStop
         * @static
         * @param {robot.IEStop} message EStop message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EStop.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a EStop message from the specified reader or buffer.
         * @function decode
         * @memberof robot.EStop
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {robot.EStop} EStop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EStop.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.robot.EStop();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a EStop message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof robot.EStop
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {robot.EStop} EStop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EStop.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a EStop message.
         * @function verify
         * @memberof robot.EStop
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EStop.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a EStop message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof robot.EStop
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {robot.EStop} EStop
         */
        EStop.fromObject = function fromObject(object) {
            if (object instanceof $root.robot.EStop)
                return object;
            return new $root.robot.EStop();
        };

        /**
         * Creates a plain object from a EStop message. Also converts values to other types if specified.
         * @function toObject
         * @memberof robot.EStop
         * @static
         * @param {robot.EStop} message EStop
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EStop.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this EStop to JSON.
         * @function toJSON
         * @memberof robot.EStop
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EStop.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for EStop
         * @function getTypeUrl
         * @memberof robot.EStop
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EStop.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/robot.EStop";
        };

        return EStop;
    })();

    robot.Reset = (function() {

        /**
         * Properties of a Reset.
         * @memberof robot
         * @interface IReset
         */

        /**
         * Constructs a new Reset.
         * @memberof robot
         * @classdesc Represents a Reset.
         * @implements IReset
         * @constructor
         * @param {robot.IReset=} [properties] Properties to set
         */
        function Reset(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new Reset instance using the specified properties.
         * @function create
         * @memberof robot.Reset
         * @static
         * @param {robot.IReset=} [properties] Properties to set
         * @returns {robot.Reset} Reset instance
         */
        Reset.create = function create(properties) {
            return new Reset(properties);
        };

        /**
         * Encodes the specified Reset message. Does not implicitly {@link robot.Reset.verify|verify} messages.
         * @function encode
         * @memberof robot.Reset
         * @static
         * @param {robot.IReset} message Reset message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Reset.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified Reset message, length delimited. Does not implicitly {@link robot.Reset.verify|verify} messages.
         * @function encodeDelimited
         * @memberof robot.Reset
         * @static
         * @param {robot.IReset} message Reset message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Reset.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Reset message from the specified reader or buffer.
         * @function decode
         * @memberof robot.Reset
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {robot.Reset} Reset
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Reset.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.robot.Reset();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Reset message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof robot.Reset
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {robot.Reset} Reset
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Reset.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Reset message.
         * @function verify
         * @memberof robot.Reset
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Reset.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a Reset message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof robot.Reset
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {robot.Reset} Reset
         */
        Reset.fromObject = function fromObject(object) {
            if (object instanceof $root.robot.Reset)
                return object;
            return new $root.robot.Reset();
        };

        /**
         * Creates a plain object from a Reset message. Also converts values to other types if specified.
         * @function toObject
         * @memberof robot.Reset
         * @static
         * @param {robot.Reset} message Reset
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Reset.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this Reset to JSON.
         * @function toJSON
         * @memberof robot.Reset
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Reset.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Reset
         * @function getTypeUrl
         * @memberof robot.Reset
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Reset.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/robot.Reset";
        };

        return Reset;
    })();

    robot.ClientMessage = (function() {

        /**
         * Properties of a ClientMessage.
         * @memberof robot
         * @interface IClientMessage
         * @property {robot.ISkillCommand|null} [skill] ClientMessage skill
         * @property {robot.IEStop|null} [eStop] ClientMessage eStop
         * @property {robot.IReset|null} [reset] ClientMessage reset
         */

        /**
         * Constructs a new ClientMessage.
         * @memberof robot
         * @classdesc Represents a ClientMessage.
         * @implements IClientMessage
         * @constructor
         * @param {robot.IClientMessage=} [properties] Properties to set
         */
        function ClientMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ClientMessage skill.
         * @member {robot.ISkillCommand|null|undefined} skill
         * @memberof robot.ClientMessage
         * @instance
         */
        ClientMessage.prototype.skill = null;

        /**
         * ClientMessage eStop.
         * @member {robot.IEStop|null|undefined} eStop
         * @memberof robot.ClientMessage
         * @instance
         */
        ClientMessage.prototype.eStop = null;

        /**
         * ClientMessage reset.
         * @member {robot.IReset|null|undefined} reset
         * @memberof robot.ClientMessage
         * @instance
         */
        ClientMessage.prototype.reset = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * ClientMessage payload.
         * @member {"skill"|"eStop"|"reset"|undefined} payload
         * @memberof robot.ClientMessage
         * @instance
         */
        Object.defineProperty(ClientMessage.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["skill", "eStop", "reset"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new ClientMessage instance using the specified properties.
         * @function create
         * @memberof robot.ClientMessage
         * @static
         * @param {robot.IClientMessage=} [properties] Properties to set
         * @returns {robot.ClientMessage} ClientMessage instance
         */
        ClientMessage.create = function create(properties) {
            return new ClientMessage(properties);
        };

        /**
         * Encodes the specified ClientMessage message. Does not implicitly {@link robot.ClientMessage.verify|verify} messages.
         * @function encode
         * @memberof robot.ClientMessage
         * @static
         * @param {robot.IClientMessage} message ClientMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClientMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.skill != null && Object.hasOwnProperty.call(message, "skill"))
                $root.robot.SkillCommand.encode(message.skill, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.eStop != null && Object.hasOwnProperty.call(message, "eStop"))
                $root.robot.EStop.encode(message.eStop, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.reset != null && Object.hasOwnProperty.call(message, "reset"))
                $root.robot.Reset.encode(message.reset, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ClientMessage message, length delimited. Does not implicitly {@link robot.ClientMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof robot.ClientMessage
         * @static
         * @param {robot.IClientMessage} message ClientMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClientMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ClientMessage message from the specified reader or buffer.
         * @function decode
         * @memberof robot.ClientMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {robot.ClientMessage} ClientMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClientMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.robot.ClientMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.skill = $root.robot.SkillCommand.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.eStop = $root.robot.EStop.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.reset = $root.robot.Reset.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ClientMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof robot.ClientMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {robot.ClientMessage} ClientMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClientMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ClientMessage message.
         * @function verify
         * @memberof robot.ClientMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ClientMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.skill != null && message.hasOwnProperty("skill")) {
                properties.payload = 1;
                {
                    let error = $root.robot.SkillCommand.verify(message.skill);
                    if (error)
                        return "skill." + error;
                }
            }
            if (message.eStop != null && message.hasOwnProperty("eStop")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.robot.EStop.verify(message.eStop);
                    if (error)
                        return "eStop." + error;
                }
            }
            if (message.reset != null && message.hasOwnProperty("reset")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.robot.Reset.verify(message.reset);
                    if (error)
                        return "reset." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ClientMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof robot.ClientMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {robot.ClientMessage} ClientMessage
         */
        ClientMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.robot.ClientMessage)
                return object;
            let message = new $root.robot.ClientMessage();
            if (object.skill != null) {
                if (typeof object.skill !== "object")
                    throw TypeError(".robot.ClientMessage.skill: object expected");
                message.skill = $root.robot.SkillCommand.fromObject(object.skill);
            }
            if (object.eStop != null) {
                if (typeof object.eStop !== "object")
                    throw TypeError(".robot.ClientMessage.eStop: object expected");
                message.eStop = $root.robot.EStop.fromObject(object.eStop);
            }
            if (object.reset != null) {
                if (typeof object.reset !== "object")
                    throw TypeError(".robot.ClientMessage.reset: object expected");
                message.reset = $root.robot.Reset.fromObject(object.reset);
            }
            return message;
        };

        /**
         * Creates a plain object from a ClientMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof robot.ClientMessage
         * @static
         * @param {robot.ClientMessage} message ClientMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ClientMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.skill != null && message.hasOwnProperty("skill")) {
                object.skill = $root.robot.SkillCommand.toObject(message.skill, options);
                if (options.oneofs)
                    object.payload = "skill";
            }
            if (message.eStop != null && message.hasOwnProperty("eStop")) {
                object.eStop = $root.robot.EStop.toObject(message.eStop, options);
                if (options.oneofs)
                    object.payload = "eStop";
            }
            if (message.reset != null && message.hasOwnProperty("reset")) {
                object.reset = $root.robot.Reset.toObject(message.reset, options);
                if (options.oneofs)
                    object.payload = "reset";
            }
            return object;
        };

        /**
         * Converts this ClientMessage to JSON.
         * @function toJSON
         * @memberof robot.ClientMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ClientMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ClientMessage
         * @function getTypeUrl
         * @memberof robot.ClientMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ClientMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/robot.ClientMessage";
        };

        return ClientMessage;
    })();

    return robot;
})();

export { $root as default };
