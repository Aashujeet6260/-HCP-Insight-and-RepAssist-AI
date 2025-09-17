import operator
from typing import TypedDict, Annotated
from langchain_core.messages import BaseMessage
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from .tools import all_tools
from ..core.config import GROQ_API_KEY
from ..db.schemas import InteractionBase


# Here we are  buiding the basic structure of how that dictates how the AI thinks and acts. 

class AgentState(TypedDict): # Memory of the Agent 
    messages: Annotated[list, operator.add]
    form_data: InteractionBase

#Intilizing the LLM model in the System
llm = ChatGroq(model="gemma2-9b-it", groq_api_key=GROQ_API_KEY, temperature=0) 
#Intilizing the LLM tools
llm_with_tools = llm.bind_tools(all_tools)

def call_model(state: AgentState):
    print("---CALLING MODEL---")
    messages = state["messages"]
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}


def should_continue(state: AgentState) -> str:
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "continue"
    else:
        return "end"
    
tool_node = ToolNode(all_tools)  

# This is Graph as working of Agent Calling and Tool calling    

workflow = StateGraph(AgentState)

workflow.add_node("agent", call_model)
workflow.add_node("action", tool_node)

workflow.set_entry_point("agent")

workflow.add_conditional_edges(
    "agent",
    should_continue,
    {
        "continue": "action",
        "end": END,
    },
)

workflow.add_edge("action", "agent")

app_graph = workflow.compile()