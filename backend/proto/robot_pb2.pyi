from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class JointState(_message.Message):
    __slots__ = ("positions", "velocities", "efforts", "gripper_closed")
    POSITIONS_FIELD_NUMBER: _ClassVar[int]
    VELOCITIES_FIELD_NUMBER: _ClassVar[int]
    EFFORTS_FIELD_NUMBER: _ClassVar[int]
    GRIPPER_CLOSED_FIELD_NUMBER: _ClassVar[int]
    positions: _containers.RepeatedScalarFieldContainer[float]
    velocities: _containers.RepeatedScalarFieldContainer[float]
    efforts: _containers.RepeatedScalarFieldContainer[float]
    gripper_closed: bool
    def __init__(self, positions: _Optional[_Iterable[float]] = ..., velocities: _Optional[_Iterable[float]] = ..., efforts: _Optional[_Iterable[float]] = ..., gripper_closed: bool = ...) -> None: ...

class TcpPose(_message.Message):
    __slots__ = ("x", "y", "z", "rx", "ry", "rz")
    X_FIELD_NUMBER: _ClassVar[int]
    Y_FIELD_NUMBER: _ClassVar[int]
    Z_FIELD_NUMBER: _ClassVar[int]
    RX_FIELD_NUMBER: _ClassVar[int]
    RY_FIELD_NUMBER: _ClassVar[int]
    RZ_FIELD_NUMBER: _ClassVar[int]
    x: float
    y: float
    z: float
    rx: float
    ry: float
    rz: float
    def __init__(self, x: _Optional[float] = ..., y: _Optional[float] = ..., z: _Optional[float] = ..., rx: _Optional[float] = ..., ry: _Optional[float] = ..., rz: _Optional[float] = ...) -> None: ...

class RobotState(_message.Message):
    __slots__ = ("joints", "tcp", "status", "cycle_count", "current_skill")
    JOINTS_FIELD_NUMBER: _ClassVar[int]
    TCP_FIELD_NUMBER: _ClassVar[int]
    STATUS_FIELD_NUMBER: _ClassVar[int]
    CYCLE_COUNT_FIELD_NUMBER: _ClassVar[int]
    CURRENT_SKILL_FIELD_NUMBER: _ClassVar[int]
    joints: JointState
    tcp: TcpPose
    status: str
    cycle_count: int
    current_skill: str
    def __init__(self, joints: _Optional[_Union[JointState, _Mapping]] = ..., tcp: _Optional[_Union[TcpPose, _Mapping]] = ..., status: _Optional[str] = ..., cycle_count: _Optional[int] = ..., current_skill: _Optional[str] = ...) -> None: ...

class Fault(_message.Message):
    __slots__ = ("id", "code", "message", "joint_index", "timestamp")
    ID_FIELD_NUMBER: _ClassVar[int]
    CODE_FIELD_NUMBER: _ClassVar[int]
    MESSAGE_FIELD_NUMBER: _ClassVar[int]
    JOINT_INDEX_FIELD_NUMBER: _ClassVar[int]
    TIMESTAMP_FIELD_NUMBER: _ClassVar[int]
    id: str
    code: str
    message: str
    joint_index: int
    timestamp: float
    def __init__(self, id: _Optional[str] = ..., code: _Optional[str] = ..., message: _Optional[str] = ..., joint_index: _Optional[int] = ..., timestamp: _Optional[float] = ...) -> None: ...

class FaultCleared(_message.Message):
    __slots__ = ()
    def __init__(self) -> None: ...

class ServerMessage(_message.Message):
    __slots__ = ("state", "fault", "fault_cleared")
    STATE_FIELD_NUMBER: _ClassVar[int]
    FAULT_FIELD_NUMBER: _ClassVar[int]
    FAULT_CLEARED_FIELD_NUMBER: _ClassVar[int]
    state: RobotState
    fault: Fault
    fault_cleared: FaultCleared
    def __init__(self, state: _Optional[_Union[RobotState, _Mapping]] = ..., fault: _Optional[_Union[Fault, _Mapping]] = ..., fault_cleared: _Optional[_Union[FaultCleared, _Mapping]] = ...) -> None: ...

class SkillCommand(_message.Message):
    __slots__ = ("skill_id",)
    SKILL_ID_FIELD_NUMBER: _ClassVar[int]
    skill_id: str
    def __init__(self, skill_id: _Optional[str] = ...) -> None: ...

class EStop(_message.Message):
    __slots__ = ()
    def __init__(self) -> None: ...

class Reset(_message.Message):
    __slots__ = ()
    def __init__(self) -> None: ...

class ClientMessage(_message.Message):
    __slots__ = ("skill", "e_stop", "reset")
    SKILL_FIELD_NUMBER: _ClassVar[int]
    E_STOP_FIELD_NUMBER: _ClassVar[int]
    RESET_FIELD_NUMBER: _ClassVar[int]
    skill: SkillCommand
    e_stop: EStop
    reset: Reset
    def __init__(self, skill: _Optional[_Union[SkillCommand, _Mapping]] = ..., e_stop: _Optional[_Union[EStop, _Mapping]] = ..., reset: _Optional[_Union[Reset, _Mapping]] = ...) -> None: ...
