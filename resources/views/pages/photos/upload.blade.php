@extends('layouts.app')

@section('content')

<div class = 'upload-wrapper'>

    <div class = 'title'>
        <h1>Upload Images</h1>
    </div>

    {!! Form::open(['action' => 'PhotosController@store', 'method' => 'POST', 'enctype' => 'multipart/form-data']) !!}

    <div class='form-section'>
        {{ Form::label('title') }}
        {{ Form::text('title', '') }}
    </div>

    <div class='form-section'>
        {{ Form::label('description') }}
        {{ Form::textarea('description', '') }}
    </div>

    <div class='form-section'>
        {{ Form::file('file') }}
    </div>

    <div class='form-section'>
        {{ Form::submit('Upload') }}
    </div>

    {!! Form::close() !!}
    
</div>

@endsection