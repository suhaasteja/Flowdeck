import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace robot. */
export namespace robot {

    /** Properties of a JointState. */
    interface IJointState {

        /** JointState positions */
        positions?: (number[]|null);

        /** JointState velocities */
        velocities?: (number[]|null);

        /** JointState efforts */
        efforts?: (number[]|null);

        /** JointState gripperClosed */
        gripperClosed?: (boolean|null);
    }

    /** Represents a JointState. */
    class JointState implements IJointState {

        /**
         * Constructs a new JointState.
         * @param [properties] Properties to set
         */
        constructor(properties?: robot.IJointState);

        /** JointState positions. */
        public positions: number[];

        /** JointState velocities. */
        public velocities: number[];

        /** JointState efforts. */
        public efforts: number[];

        /** JointState gripperClosed. */
        public gripperClosed: boolean;

        /**
         * Creates a new JointState instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JointState instance
         */
        public static create(properties?: robot.IJointState): robot.JointState;

        /**
         * Encodes the specified JointState message. Does not implicitly {@link robot.JointState.verify|verify} messages.
         * @param message JointState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: robot.IJointState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified JointState message, length delimited. Does not implicitly {@link robot.JointState.verify|verify} messages.
         * @param message JointState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: robot.IJointState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a JointState message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JointState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): robot.JointState;

        /**
         * Decodes a JointState message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns JointState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): robot.JointState;

        /**
         * Verifies a JointState message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a JointState message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns JointState
         */
        public static fromObject(object: { [k: string]: any }): robot.JointState;

        /**
         * Creates a plain object from a JointState message. Also converts values to other types if specified.
         * @param message JointState
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: robot.JointState, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this JointState to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for JointState
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TcpPose. */
    interface ITcpPose {

        /** TcpPose x */
        x?: (number|null);

        /** TcpPose y */
        y?: (number|null);

        /** TcpPose z */
        z?: (number|null);

        /** TcpPose rx */
        rx?: (number|null);

        /** TcpPose ry */
        ry?: (number|null);

        /** TcpPose rz */
        rz?: (number|null);
    }

    /** Represents a TcpPose. */
    class TcpPose implements ITcpPose {

        /**
         * Constructs a new TcpPose.
         * @param [properties] Properties to set
         */
        constructor(properties?: robot.ITcpPose);

        /** TcpPose x. */
        public x: number;

        /** TcpPose y. */
        public y: number;

        /** TcpPose z. */
        public z: number;

        /** TcpPose rx. */
        public rx: number;

        /** TcpPose ry. */
        public ry: number;

        /** TcpPose rz. */
        public rz: number;

        /**
         * Creates a new TcpPose instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TcpPose instance
         */
        public static create(properties?: robot.ITcpPose): robot.TcpPose;

        /**
         * Encodes the specified TcpPose message. Does not implicitly {@link robot.TcpPose.verify|verify} messages.
         * @param message TcpPose message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: robot.ITcpPose, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TcpPose message, length delimited. Does not implicitly {@link robot.TcpPose.verify|verify} messages.
         * @param message TcpPose message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: robot.ITcpPose, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TcpPose message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TcpPose
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): robot.TcpPose;

        /**
         * Decodes a TcpPose message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TcpPose
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): robot.TcpPose;

        /**
         * Verifies a TcpPose message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TcpPose message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TcpPose
         */
        public static fromObject(object: { [k: string]: any }): robot.TcpPose;

        /**
         * Creates a plain object from a TcpPose message. Also converts values to other types if specified.
         * @param message TcpPose
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: robot.TcpPose, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TcpPose to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TcpPose
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a RobotState. */
    interface IRobotState {

        /** RobotState joints */
        joints?: (robot.IJointState|null);

        /** RobotState tcp */
        tcp?: (robot.ITcpPose|null);

        /** RobotState status */
        status?: (string|null);

        /** RobotState cycleCount */
        cycleCount?: (number|null);

        /** RobotState currentSkill */
        currentSkill?: (string|null);
    }

    /** Represents a RobotState. */
    class RobotState implements IRobotState {

        /**
         * Constructs a new RobotState.
         * @param [properties] Properties to set
         */
        constructor(properties?: robot.IRobotState);

        /** RobotState joints. */
        public joints?: (robot.IJointState|null);

        /** RobotState tcp. */
        public tcp?: (robot.ITcpPose|null);

        /** RobotState status. */
        public status: string;

        /** RobotState cycleCount. */
        public cycleCount: number;

        /** RobotState currentSkill. */
        public currentSkill: string;

        /**
         * Creates a new RobotState instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RobotState instance
         */
        public static create(properties?: robot.IRobotState): robot.RobotState;

        /**
         * Encodes the specified RobotState message. Does not implicitly {@link robot.RobotState.verify|verify} messages.
         * @param message RobotState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: robot.IRobotState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RobotState message, length delimited. Does not implicitly {@link robot.RobotState.verify|verify} messages.
         * @param message RobotState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: robot.IRobotState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RobotState message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RobotState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): robot.RobotState;

        /**
         * Decodes a RobotState message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RobotState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): robot.RobotState;

        /**
         * Verifies a RobotState message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RobotState message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RobotState
         */
        public static fromObject(object: { [k: string]: any }): robot.RobotState;

        /**
         * Creates a plain object from a RobotState message. Also converts values to other types if specified.
         * @param message RobotState
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: robot.RobotState, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RobotState to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for RobotState
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Fault. */
    interface IFault {

        /** Fault id */
        id?: (string|null);

        /** Fault code */
        code?: (string|null);

        /** Fault message */
        message?: (string|null);

        /** Fault jointIndex */
        jointIndex?: (number|null);

        /** Fault timestamp */
        timestamp?: (number|null);
    }

    /** Represents a Fault. */
    class Fault implements IFault {

        /**
         * Constructs a new Fault.
         * @param [properties] Properties to set
         */
        constructor(properties?: robot.IFault);

        /** Fault id. */
        public id: string;

        /** Fault code. */
        public code: string;

        /** Fault message. */
        public message: string;

        /** Fault jointIndex. */
        public jointIndex: number;

        /** Fault timestamp. */
        public timestamp: number;

        /**
         * Creates a new Fault instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Fault instance
         */
        public static create(properties?: robot.IFault): robot.Fault;

        /**
         * Encodes the specified Fault message. Does not implicitly {@link robot.Fault.verify|verify} messages.
         * @param message Fault message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: robot.IFault, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Fault message, length delimited. Does not implicitly {@link robot.Fault.verify|verify} messages.
         * @param message Fault message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: robot.IFault, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Fault message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Fault
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): robot.Fault;

        /**
         * Decodes a Fault message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Fault
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): robot.Fault;

        /**
         * Verifies a Fault message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Fault message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Fault
         */
        public static fromObject(object: { [k: string]: any }): robot.Fault;

        /**
         * Creates a plain object from a Fault message. Also converts values to other types if specified.
         * @param message Fault
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: robot.Fault, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Fault to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Fault
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FaultCleared. */
    interface IFaultCleared {
    }

    /** Represents a FaultCleared. */
    class FaultCleared implements IFaultCleared {

        /**
         * Constructs a new FaultCleared.
         * @param [properties] Properties to set
         */
        constructor(properties?: robot.IFaultCleared);

        /**
         * Creates a new FaultCleared instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FaultCleared instance
         */
        public static create(properties?: robot.IFaultCleared): robot.FaultCleared;

        /**
         * Encodes the specified FaultCleared message. Does not implicitly {@link robot.FaultCleared.verify|verify} messages.
         * @param message FaultCleared message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: robot.IFaultCleared, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FaultCleared message, length delimited. Does not implicitly {@link robot.FaultCleared.verify|verify} messages.
         * @param message FaultCleared message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: robot.IFaultCleared, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FaultCleared message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FaultCleared
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): robot.FaultCleared;

        /**
         * Decodes a FaultCleared message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FaultCleared
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): robot.FaultCleared;

        /**
         * Verifies a FaultCleared message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FaultCleared message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FaultCleared
         */
        public static fromObject(object: { [k: string]: any }): robot.FaultCleared;

        /**
         * Creates a plain object from a FaultCleared message. Also converts values to other types if specified.
         * @param message FaultCleared
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: robot.FaultCleared, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FaultCleared to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FaultCleared
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ServerMessage. */
    interface IServerMessage {

        /** ServerMessage state */
        state?: (robot.IRobotState|null);

        /** ServerMessage fault */
        fault?: (robot.IFault|null);

        /** ServerMessage faultCleared */
        faultCleared?: (robot.IFaultCleared|null);
    }

    /** Represents a ServerMessage. */
    class ServerMessage implements IServerMessage {

        /**
         * Constructs a new ServerMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: robot.IServerMessage);

        /** ServerMessage state. */
        public state?: (robot.IRobotState|null);

        /** ServerMessage fault. */
        public fault?: (robot.IFault|null);

        /** ServerMessage faultCleared. */
        public faultCleared?: (robot.IFaultCleared|null);

        /** ServerMessage payload. */
        public payload?: ("state"|"fault"|"faultCleared");

        /**
         * Creates a new ServerMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ServerMessage instance
         */
        public static create(properties?: robot.IServerMessage): robot.ServerMessage;

        /**
         * Encodes the specified ServerMessage message. Does not implicitly {@link robot.ServerMessage.verify|verify} messages.
         * @param message ServerMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: robot.IServerMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ServerMessage message, length delimited. Does not implicitly {@link robot.ServerMessage.verify|verify} messages.
         * @param message ServerMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: robot.IServerMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ServerMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ServerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): robot.ServerMessage;

        /**
         * Decodes a ServerMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ServerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): robot.ServerMessage;

        /**
         * Verifies a ServerMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ServerMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ServerMessage
         */
        public static fromObject(object: { [k: string]: any }): robot.ServerMessage;

        /**
         * Creates a plain object from a ServerMessage message. Also converts values to other types if specified.
         * @param message ServerMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: robot.ServerMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ServerMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ServerMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SkillCommand. */
    interface ISkillCommand {

        /** SkillCommand skillId */
        skillId?: (string|null);
    }

    /** Represents a SkillCommand. */
    class SkillCommand implements ISkillCommand {

        /**
         * Constructs a new SkillCommand.
         * @param [properties] Properties to set
         */
        constructor(properties?: robot.ISkillCommand);

        /** SkillCommand skillId. */
        public skillId: string;

        /**
         * Creates a new SkillCommand instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SkillCommand instance
         */
        public static create(properties?: robot.ISkillCommand): robot.SkillCommand;

        /**
         * Encodes the specified SkillCommand message. Does not implicitly {@link robot.SkillCommand.verify|verify} messages.
         * @param message SkillCommand message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: robot.ISkillCommand, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SkillCommand message, length delimited. Does not implicitly {@link robot.SkillCommand.verify|verify} messages.
         * @param message SkillCommand message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: robot.ISkillCommand, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SkillCommand message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SkillCommand
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): robot.SkillCommand;

        /**
         * Decodes a SkillCommand message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SkillCommand
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): robot.SkillCommand;

        /**
         * Verifies a SkillCommand message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SkillCommand message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SkillCommand
         */
        public static fromObject(object: { [k: string]: any }): robot.SkillCommand;

        /**
         * Creates a plain object from a SkillCommand message. Also converts values to other types if specified.
         * @param message SkillCommand
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: robot.SkillCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SkillCommand to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SkillCommand
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a EStop. */
    interface IEStop {
    }

    /** Represents a EStop. */
    class EStop implements IEStop {

        /**
         * Constructs a new EStop.
         * @param [properties] Properties to set
         */
        constructor(properties?: robot.IEStop);

        /**
         * Creates a new EStop instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EStop instance
         */
        public static create(properties?: robot.IEStop): robot.EStop;

        /**
         * Encodes the specified EStop message. Does not implicitly {@link robot.EStop.verify|verify} messages.
         * @param message EStop message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: robot.IEStop, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EStop message, length delimited. Does not implicitly {@link robot.EStop.verify|verify} messages.
         * @param message EStop message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: robot.IEStop, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a EStop message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EStop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): robot.EStop;

        /**
         * Decodes a EStop message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EStop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): robot.EStop;

        /**
         * Verifies a EStop message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a EStop message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EStop
         */
        public static fromObject(object: { [k: string]: any }): robot.EStop;

        /**
         * Creates a plain object from a EStop message. Also converts values to other types if specified.
         * @param message EStop
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: robot.EStop, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EStop to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for EStop
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Reset. */
    interface IReset {
    }

    /** Represents a Reset. */
    class Reset implements IReset {

        /**
         * Constructs a new Reset.
         * @param [properties] Properties to set
         */
        constructor(properties?: robot.IReset);

        /**
         * Creates a new Reset instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Reset instance
         */
        public static create(properties?: robot.IReset): robot.Reset;

        /**
         * Encodes the specified Reset message. Does not implicitly {@link robot.Reset.verify|verify} messages.
         * @param message Reset message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: robot.IReset, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Reset message, length delimited. Does not implicitly {@link robot.Reset.verify|verify} messages.
         * @param message Reset message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: robot.IReset, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Reset message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Reset
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): robot.Reset;

        /**
         * Decodes a Reset message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Reset
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): robot.Reset;

        /**
         * Verifies a Reset message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Reset message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Reset
         */
        public static fromObject(object: { [k: string]: any }): robot.Reset;

        /**
         * Creates a plain object from a Reset message. Also converts values to other types if specified.
         * @param message Reset
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: robot.Reset, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Reset to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Reset
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ClientMessage. */
    interface IClientMessage {

        /** ClientMessage skill */
        skill?: (robot.ISkillCommand|null);

        /** ClientMessage eStop */
        eStop?: (robot.IEStop|null);

        /** ClientMessage reset */
        reset?: (robot.IReset|null);
    }

    /** Represents a ClientMessage. */
    class ClientMessage implements IClientMessage {

        /**
         * Constructs a new ClientMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: robot.IClientMessage);

        /** ClientMessage skill. */
        public skill?: (robot.ISkillCommand|null);

        /** ClientMessage eStop. */
        public eStop?: (robot.IEStop|null);

        /** ClientMessage reset. */
        public reset?: (robot.IReset|null);

        /** ClientMessage payload. */
        public payload?: ("skill"|"eStop"|"reset");

        /**
         * Creates a new ClientMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ClientMessage instance
         */
        public static create(properties?: robot.IClientMessage): robot.ClientMessage;

        /**
         * Encodes the specified ClientMessage message. Does not implicitly {@link robot.ClientMessage.verify|verify} messages.
         * @param message ClientMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: robot.IClientMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ClientMessage message, length delimited. Does not implicitly {@link robot.ClientMessage.verify|verify} messages.
         * @param message ClientMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: robot.IClientMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ClientMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ClientMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): robot.ClientMessage;

        /**
         * Decodes a ClientMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ClientMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): robot.ClientMessage;

        /**
         * Verifies a ClientMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ClientMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ClientMessage
         */
        public static fromObject(object: { [k: string]: any }): robot.ClientMessage;

        /**
         * Creates a plain object from a ClientMessage message. Also converts values to other types if specified.
         * @param message ClientMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: robot.ClientMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ClientMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ClientMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
